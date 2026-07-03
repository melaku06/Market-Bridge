import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, createAuditLog } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const actor_id = searchParams.get('actor_id') || undefined;
    const entity_type = searchParams.get('entity_type') || undefined;
    const action = searchParams.get('action') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { logs, total } = await getAuditLogs({
      actor_id,
      entity_type,
      action,
      limit,
      offset,
    });

    return NextResponse.json({
      data: logs,
      pagination: { total, limit, offset, has_more: offset + limit < total }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const log = await createAuditLog({
      actor_id: body.actor_id,
      actor_name: body.actor_name,
      actor_role: body.actor_role,
      action: body.action,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      before_state: body.before,
      after_state: body.after,
      ip_address: body.ip_address,
    });

    return NextResponse.json({ data: log }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}
