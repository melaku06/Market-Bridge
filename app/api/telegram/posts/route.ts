import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramPosts, createTelegramPost, getTelegramBot } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || undefined;
    const product_id = searchParams.get('product_id') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await getTelegramPosts({ status, product_id, limit, offset });
    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error('Error fetching telegram posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    if (!body.product_id || !body.message) {
      return NextResponse.json({ error: 'Product ID and message are required' }, { status: 400 });
    }

    const bot = await getTelegramBot();
    if (!bot) {
      return NextResponse.json({ error: 'Configure the Telegram bot first' }, { status: 400 });
    }

    const post = await createTelegramPost({
      bot: { connect: { id: bot.id } },
      product: { connect: { id: body.product_id } },
      product_name: body.product_name || '',
      template: body.template_id ? { connect: { id: body.template_id } } : undefined,
      target_type: body.target_type || 'channel',
      channel: body.channel_id ? { connect: { id: body.channel_id } } : undefined,
      group: body.group_id ? { connect: { id: body.group_id } } : undefined,
      message: body.message,
      image_urls: body.image_urls || [],
      status: 'queued',
      scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : null,
    });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    console.error('Error creating telegram post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
