import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramChannels, createTelegramChannel } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const is_active = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined;

    const channels = await getTelegramChannels({ is_active });
    return NextResponse.json({ data: channels });
  } catch (error) {
    console.error('Error fetching telegram channels:', error);
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    if (!body.channel_id || !body.channel_name) {
      return NextResponse.json({ error: 'Channel ID and name are required' }, { status: 400 });
    }

    const bot = await import('@/lib/db-service').then(m => m.getTelegramBot());
    if (!bot) {
      return NextResponse.json({ error: 'Configure the Telegram bot first' }, { status: 400 });
    }

    const channel = await createTelegramChannel({
      bot: { connect: { id: bot.id } },
      channel_id: body.channel_id,
      channel_name: body.channel_name,
      channel_username: body.channel_username,
      member_count: body.member_count || 0,
      is_active: body.is_active !== undefined ? body.is_active : true,
    });
    return NextResponse.json({ data: channel }, { status: 201 });
  } catch (error) {
    console.error('Error creating telegram channel:', error);
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}
