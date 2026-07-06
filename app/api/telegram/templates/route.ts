import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { getTelegramTemplates, createTelegramTemplate, getTelegramBot } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const { searchParams } = request.nextUrl;
    const is_active = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined;

    const templates = await getTelegramTemplates({ is_active });
    return NextResponse.json({ data: templates });
  } catch (error) {
    console.error('Error fetching telegram templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;

    const body = await request.json();
    if (!body.name || !body.template) {
      return NextResponse.json({ error: 'Name and template are required' }, { status: 400 });
    }

    const bot = await getTelegramBot();
    if (!bot) {
      return NextResponse.json({ error: 'Configure the Telegram bot first' }, { status: 400 });
    }

    const template = await createTelegramTemplate({
      bot: { connect: { id: bot.id } },
      name: body.name,
      template: body.template,
      variables: body.variables || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
    });
    return NextResponse.json({ data: template }, { status: 201 });
  } catch (error) {
    console.error('Error creating telegram template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
