import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createPasswordResetToken, expirePasswordResetTokens } from '@/lib/db-service';
import { hashToken } from '@/lib/auth/password';
import { createAuditLog } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const { telegram_username } = await request.json();

    if (!telegram_username || typeof telegram_username !== 'string') {
      return NextResponse.json(
        { error: 'Telegram username is required' },
        { status: 400 }
      );
    }

    const normalizedUsername = telegram_username.trim().replace(/^@/, '').toLowerCase();

    const user = await prisma.profile.findFirst({
      where: {
        telegram_username: { equals: normalizedUsername, mode: 'insensitive' },
        deleted_at: null,
      },
      select: { id: true, name: true, telegram_username: true, telegram_id: true },
    });

    // Always return success to prevent user enumeration
    if (!user || !user.telegram_username) {
      return NextResponse.json({
        success: true,
        message: 'If an account is linked to this Telegram username, a reset code has been sent to your Telegram.',
      });
    }

    // Generate a 6-digit temporary code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = hashToken(resetCode);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Expire any existing pending tokens for this user
    await expirePasswordResetTokens(user.id);

    // Create new token
    await createPasswordResetToken(user.id, tokenHash, expiresAt);

    // Create audit log
    await createAuditLog({
      actor_id: user.id,
      actor_name: user.name,
      actor_role: 'customer',
      action: 'PASSWORD_RESET_REQUESTED',
      entity_type: 'profile',
      entity_id: user.id,
      description: `Password reset requested via Telegram (@${normalizedUsername})`,
    });

    // In production: Send the reset code to the user's Telegram via the Telegram Bot
    // For now, the code is stored in the database and the user must enter it
    // When Telegram Bot integration is implemented, this is where the bot.sendMessage() call would go
    console.log(`[Password Reset] Temporary code for @${normalizedUsername}: ${resetCode}`);

    return NextResponse.json({
      success: true,
      message: 'If an account is linked to this Telegram username, a reset code has been sent to your Telegram.',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
