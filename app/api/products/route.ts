import { NextRequest, NextResponse } from 'next/server';
import { db, Product, ProductStatus, generateId } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const status = searchParams.get('status') as ProductStatus | null;
  const warehouse_id = searchParams.get('warehouse_id');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let products = [...db.products];

  // Filter by category
  if (category) {
    products = products.filter(p => p.category_id === category || p.category_name.toLowerCase() === category.toLowerCase());
  }

  // Filter by status
  if (status) {
    products = products.filter(p => p.status === status);
  }

  // Filter by warehouse
  if (warehouse_id) {
    products = products.filter(p => p.warehouse_id === warehouse_id);
  }

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // Sort by created_at desc
  products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = products.length;
  const paginatedProducts = products.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedProducts,
    pagination: { total, limit, offset, has_more: offset + limit < total }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProduct: Product = {
      id: generateId('prod'),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      short_description: body.short_description || '',
      warehouse_id: body.warehouse_id,
      category_id: body.category_id,
      category_name: body.category_name || '',
      base_price: parseFloat(body.base_price) || 0,
      margin_percent: parseFloat(body.margin_percent) || 18,
      final_price: parseFloat(body.final_price) || parseFloat(body.base_price) * 1.18,
      discount_percent: parseInt(body.discount_percent) || 0,
      original_price: parseFloat(body.original_price) || parseFloat(body.final_price),
      images: body.images || [],
      rating: 0,
      review_count: 0,
      sold_count: 0,
      status: body.status || 'draft',
      tags: body.tags || [],
      brand: body.brand,
      sku: body.sku,
      weight: body.weight,
      colors: body.colors || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.products.push(newProduct);

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
