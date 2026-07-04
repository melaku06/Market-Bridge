import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { updateUserProfile } from '@/lib/auth/db-service';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();
    const updates: { name?: string; phone?: string; avatar_url?: string } = {};

    if (body.name) updates.name = body.name;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;

    const updatedUser = await updateUserProfile(user!.id, updates);

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
