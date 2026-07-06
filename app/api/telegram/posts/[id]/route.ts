import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramPostById, updateTelegramPost, deleteTelegramPost } from '@/lib/db-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const post = await getTelegramPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Error fetching telegram post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    const updated = await updateTelegramPost(params.id, {
      message: body.message,
      image_urls: body.image_urls,
      status: body.status,
      scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : undefined,
      retry_count: body.retry_count,
      next_retry_at: body.next_retry_at ? new Date(body.next_retry_at) : undefined,
      error: body.error,
      sent_at: body.sent_at ? new Date(body.sent_at) : undefined,
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating telegram post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    await deleteTelegramPost(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting telegram post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
