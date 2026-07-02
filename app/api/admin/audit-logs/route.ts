import { NextRequest, NextResponse } from 'next/server';
import { db, AuditLog, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const actor_role = searchParams.get('actor_role');
  const action = searchParams.get('action');
  const entity_type = searchParams.get('entity_type');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let logs = [...db.audit_logs];

  // Filter by actor role
  if (actor_role) {
    logs = logs.filter(l => l.actor_role === actor_role);
  }

  // Filter by action
  if (action) {
    logs = logs.filter(l => l.action === action);
  }

  // Filter by entity type
  if (entity_type) {
    logs = logs.filter(l => l.entity_type === entity_type);
  }

  // Sort by created_at desc
  logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = logs.length;
  const paginatedLogs = logs.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedLogs,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newLog: AuditLog = {
      id: generateId('log'),
      actor_id: body.actor_id,
      actor_name: body.actor_name,
      actor_role: body.actor_role,
      action: body.action,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      before: body.before,
      after: body.after,
      ip_address: body.ip_address,
      created_at: new Date().toISOString(),
    };

    db.audit_logs.push(newLog);

    return NextResponse.json({ data: newLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
