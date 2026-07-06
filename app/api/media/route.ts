import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getMediaAssets } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || undefined;
    const folder = searchParams.get('folder') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Non-admins can only see their own uploads
    const uploaded_by = user!.role === 'admin' ? searchParams.get('uploaded_by') || undefined : user!.id;

    const assets = await getMediaAssets({ uploaded_by, type, folder, limit, offset });
    return NextResponse.json({ data: assets });
  } catch (error) {
    console.error('Error fetching media assets:', error);
    return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}
