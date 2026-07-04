import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettings, updateSystemSettings } from '@/lib/db-service';
import { requireAuth } from '@/lib/auth/require-auth';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const settings = await getSystemSettings();

    if (!settings) {
      return NextResponse.json({ data: null });
    }

    const serialized = {
      ...settings,
      site_phone: settings.site_phone ?? '',
    };

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return NextResponse.json({ error: 'Failed to fetch system settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();

    const settings = await updateSystemSettings(body);

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json({ error: 'Failed to update system settings' }, { status: 500 });
  }
}
