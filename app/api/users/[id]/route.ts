import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { profileUpdateSchema, userStatusUpdateSchema } from '@/lib/validations/user';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.profile.findUnique({
      where: { id },
      include: {
        warehouse: { select: { id: true, name: true, status: true } },
        credentials: false,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if this is a status update (admin action)
    if (body.status && !body.name && !body.email) {
      const result = userStatusUpdateSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: result.error.flatten() },
          { status: 400 }
        );
      }

      const user = await prisma.profile.update({
        where: { id },
        data: { status: result.data.status },
      });

      return NextResponse.json({ data: user });
    }

    // Regular profile update
    const result = profileUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const user = await prisma.profile.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.profile.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
