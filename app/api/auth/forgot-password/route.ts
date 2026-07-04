import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.profile.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true },
    });

    // Always return success to prevent email enumeration attacks
    // In production, a reset email would be sent here
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
