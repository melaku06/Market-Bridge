import 'server-only';
import prisma from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/auth/password';
import { signToken, verifyToken, JwtPayload } from '@/lib/jwt';
import type { AuthUser, AuthResponse, LoginCredentials, RegisterData, UserRole } from '@/lib/auth/types';

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const { email, password, name, role = 'customer', phone } = data;

    const existingUser = await prisma.profile.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.profile.create({
        data: {
          id: userId,
          email: email.toLowerCase(),
          name,
          role: role as any,
          phone,
        },
      });

      await tx.userCredential.create({
        data: {
          user_id: user.id,
          password_hash: hashedPassword,
        },
      });

      return user;
    });

    const user = await getUserById(result.id);
    if (!user) {
      return { success: false, error: 'Failed to create user' };
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return { success: true, user, token };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const { email, password } = credentials;

    const result = await prisma.profile.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        credentials: true,
      },
    });

    if (!result || !result.credentials) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!result.is_active) {
      return { success: false, error: 'Your account has been deactivated' };
    }

    const isValid = await comparePassword(password, result.credentials.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = await getUserById(result.id);
    if (!user) {
      return { success: false, error: 'Failed to fetch user' };
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return { success: true, user, token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const result = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!result) return null;

    const user: AuthUser = {
      id: result.id,
      email: result.email,
      name: result.name,
      phone: result.phone || undefined,
      avatar_url: result.avatar_url || undefined,
      role: result.role as UserRole,
      warehouse_id: result.warehouse_id || undefined,
      is_active: result.is_active,
      created_at: result.created_at.toISOString(),
      updated_at: result.updated_at.toISOString(),
      warehouse: result.warehouse,
    };

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function validateTokenUser(payload: JwtPayload): Promise<AuthUser | null> {
  if (!payload || !payload.userId) return null;

  const user = await getUserById(payload.userId);

  if (!user || !user.is_active) return null;

  if (user.email !== payload.email || user.role !== payload.role) {
    return null;
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  updates: { name?: string; phone?: string; avatar_url?: string }
): Promise<AuthUser | null> {
  try {
    await prisma.profile.update({
      where: { id: userId },
      data: updates,
    });

    return getUserById(userId);
  } catch (error) {
    console.error('Update profile error:', error);
    return null;
  }
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await prisma.userCredential.findUnique({
      where: { user_id: userId },
    });

    if (!result) {
      return { success: false, error: 'User not found' };
    }

    const isValid = await comparePassword(currentPassword, result.password_hash);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.userCredential.update({
      where: { user_id: userId },
      data: { password_hash: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'Failed to update password' };
  }
}
