import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db-service';
import { categoryCreateSchema } from '@/lib/validations/common';
import { invalidateCategories } from '@/lib/cached-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const is_active = searchParams.get('is_active');
    const parent_id = searchParams.get('parent_id');

    const categories = await getCategories({
      is_active: is_active ? is_active === 'true' : undefined,
      parent_id: parent_id || undefined,
    });

    return NextResponse.json(
      { data: categories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = categoryCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Generate slug from name
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const category = await createCategory({
      name: data.name,
      slug,
      description: data.description,
      image_url: data.image_url,
      parent: data.parent_id ? { connect: { id: data.parent_id } } : undefined,
      is_active: true,
    });

    invalidateCategories();
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
