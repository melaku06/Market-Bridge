import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPasswordResetToken, markPasswordResetTokenUsed } from '@/lib/db-service';
import { hashToken, hashPassword } from '@/lib/auth/password';
import { createAuditLog } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const { telegram_username, reset_code, new_password } = await request.json();

    if (!telegram_username || !reset_code || !new_password) {
      return NextResponse.json(
        { error: 'Telegram username, reset code, and new password are required' },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const normalizedUsername = telegram_username.trim().replace(/^@/, '').toLowerCase();
    const tokenHash = hashToken(reset_code.trim());

    // Find the token
    const tokenRecord = await getPasswordResetToken(tokenHash);

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    if (tokenRecord.status !== 'pending') {
      return NextResponse.json(
        { error: 'This reset code has already been used or expired' },
        { status: 400 }
      );
    }

    if (new Date() > tokenRecord.expires_at) {
      await prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { status: 'expired' },
      });
      return NextResponse.json(
        { error: 'This reset code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the token belongs to the user with this Telegram username
    if (tokenRecord.user.telegram_username?.toLowerCase() !== normalizedUsername) {
      return NextResponse.json(
        { error: 'Invalid reset code' },
        { status: 400 }
      );
    }

    // Update the password
    const passwordHash = await hashPassword(new_password);
    await prisma.userCredential.update({
      where: { user_id: tokenRecord.user_id },
      data: { password_hash: passwordHash },
    });

    // Mark token as used
    await markPasswordResetTokenUsed(tokenRecord.id);

    // Create audit log
    await createAuditLog({
      actor_id: tokenRecord.user_id,
      actor_name: tokenRecord.user.name,
      actor_role: tokenRecord.user.role,
      action: 'PASSWORD_RESET_COMPLETED',
      entity_type: 'profile',
      entity_id: tokenRecord.user_id,
      description: 'Password reset completed via Telegram',
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
