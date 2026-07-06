import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramBot, createTelegramBot, updateTelegramBot } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const bot = await getTelegramBot();
    return NextResponse.json({ data: bot });
  } catch (error) {
    console.error('Error fetching telegram bot:', error);
    return NextResponse.json({ error: 'Failed to fetch bot configuration' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();

    if (!body.bot_token) {
      return NextResponse.json({ error: 'Bot token is required' }, { status: 400 });
    }

    const existing = await getTelegramBot();
    if (existing) {
      const updated = await updateTelegramBot(existing.id, {
        bot_token: body.bot_token,
        bot_username: body.bot_username,
        bot_name: body.bot_name,
        webhook_url: body.webhook_url,
        status: 'disconnected',
      });
      return NextResponse.json({ data: updated });
    }

    const bot = await createTelegramBot({
      bot_token: body.bot_token,
      bot_username: body.bot_username,
      bot_name: body.bot_name,
      webhook_url: body.webhook_url,
    });
    return NextResponse.json({ data: bot }, { status: 201 });
  } catch (error) {
    console.error('Error creating telegram bot:', error);
    return NextResponse.json({ error: 'Failed to save bot configuration' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    const existing = await getTelegramBot();
    if (!existing) {
      return NextResponse.json({ error: 'Bot configuration not found' }, { status: 404 });
    }

    const updated = await updateTelegramBot(existing.id, {
      bot_token: body.bot_token,
      bot_username: body.bot_username,
      bot_name: body.bot_name,
      webhook_url: body.webhook_url,
      status: body.status,
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating telegram bot:', error);
    return NextResponse.json({ error: 'Failed to update bot configuration' }, { status: 500 });
  }
}
