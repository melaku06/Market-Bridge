import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramGroups, createTelegramGroup, getTelegramBot } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const is_active = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined;

    const groups = await getTelegramGroups({ is_active });
    return NextResponse.json({ data: groups });
  } catch (error) {
    console.error('Error fetching telegram groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    if (!body.group_id || !body.group_name) {
      return NextResponse.json({ error: 'Group ID and name are required' }, { status: 400 });
    }

    const bot = await getTelegramBot();
    if (!bot) {
      return NextResponse.json({ error: 'Configure the Telegram bot first' }, { status: 400 });
    }

    const group = await createTelegramGroup({
      bot: { connect: { id: bot.id } },
      group_id: body.group_id,
      group_name: body.group_name,
      group_username: body.group_username,
      member_count: body.member_count || 0,
      is_active: body.is_active !== undefined ? body.is_active : true,
    });
    return NextResponse.json({ data: group }, { status: 201 });
  } catch (error) {
    console.error('Error creating telegram group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
