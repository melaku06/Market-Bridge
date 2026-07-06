import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramActivityLogs } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const bot_id = searchParams.get('bot_id') || undefined;
    const post_id = searchParams.get('post_id') || undefined;
    const action = searchParams.get('action') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const logs = await getTelegramActivityLogs({ bot_id, post_id, action, status, limit, offset });
    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error('Error fetching telegram activity logs:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}
