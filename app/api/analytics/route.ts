import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics, getDashboardStats } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type');
    const warehouse_id = searchParams.get('warehouse_id') || undefined;
    const user_id = searchParams.get('user_id') || undefined;
    const role = searchParams.get('role') || undefined;

    // If user_id and role provided, get user-specific dashboard stats
    if (user_id && role) {
      const stats = await getDashboardStats(user_id, role);
      return NextResponse.json({ data: stats });
    }

    const analytics = await getAnalytics(warehouse_id);

    // Return specific analytics type
    if (type && analytics[type as keyof typeof analytics]) {
      return NextResponse.json({ data: { [type]: analytics[type as keyof typeof analytics] } });
    }

    return NextResponse.json({ data: analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
