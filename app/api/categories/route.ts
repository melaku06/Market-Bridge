import { NextRequest, NextResponse } from 'next/server';
import { db, Category, generateId } from '@/lib/mock-db';

export async function GET() {
  const categories = db.categories.filter(c => c.status === 'active');

  return NextResponse.json({ data: categories });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newCategory: Category = {
      id: generateId('cat'),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      image: body.image,
      icon: body.icon || '',
      parent_id: body.parent_id,
      status: body.status || 'active',
      product_count: 0,
      sub_category_count: 0,
      created_at: new Date().toISOString(),
    };

    db.categories.push(newCategory);

    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
