import { NextRequest, NextResponse } from 'next/server';
import { getMarginRules, createMarginRule } from '@/lib/db-service';
import { marginRuleCreateSchema } from '@/lib/validations/common';
import { requireAuth } from '@/lib/auth/require-auth';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;
    const margins = await getMarginRules();

    const serialized = margins.map(m => ({
      ...m,
      warehouse_margin: Number(m.warehouse_margin),
      platform_margin: Number(m.platform_margin),
      total_margin: Number(m.total_margin),
      status: m.is_active ? 'active' : 'inactive' as const,
    }));

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error('Error fetching margin rules:', error);
    return NextResponse.json({ error: 'Failed to fetch margin rules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth(request, ['admin']);
    if (error) return error;
    const body = await request.json();

    // Validate input
    const result = marginRuleCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const margin = await createMarginRule({
      category: result.data.category_id ? { connect: { id: result.data.category_id } } : undefined,
      product_id: result.data.product_id,
      category_name: result.data.category_name,
      warehouse_margin: result.data.warehouse_margin,
      platform_margin: result.data.platform_margin,
      total_margin: result.data.warehouse_margin + result.data.platform_margin,
      is_active: result.data.is_active,
    });

    return NextResponse.json({ data: margin }, { status: 201 });
  } catch (error) {
    console.error('Error creating margin rule:', error);
    return NextResponse.json({ error: 'Failed to create margin rule' }, { status: 500 });
  }
}
