import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { updateTelegramTemplate, deleteTelegramTemplate } from '@/lib/db-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    const updated = await updateTelegramTemplate(params.id, {
      name: body.name,
      template: body.template,
      variables: body.variables,
      is_active: body.is_active,
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating telegram template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    await deleteTelegramTemplate(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting telegram template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
