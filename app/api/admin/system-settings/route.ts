import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettings, updateSystemSettings } from '@/lib/db-service';

export async function GET() {
  try {
    const settings = await getSystemSettings();

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return NextResponse.json({ error: 'Failed to fetch system settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const settings = await updateSystemSettings(body);

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json({ error: 'Failed to update system settings' }, { status: 500 });
  }
}
