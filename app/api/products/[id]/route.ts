import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = db.products.find(p => p.id === params.id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productIndex = db.products.findIndex(p => p.id === params.id);

  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const existingProduct = db.products[productIndex];

    const updatedProduct = {
      ...existingProduct,
      name: body.name ?? existingProduct.name,
      slug: body.slug ?? existingProduct.slug,
      description: body.description ?? existingProduct.description,
      short_description: body.short_description ?? existingProduct.short_description,
      base_price: body.base_price !== undefined ? parseFloat(body.base_price) : existingProduct.base_price,
      margin_percent: body.margin_percent !== undefined ? parseFloat(body.margin_percent) : existingProduct.margin_percent,
      final_price: body.final_price !== undefined ? parseFloat(body.final_price) : existingProduct.final_price,
      discount_percent: body.discount_percent !== undefined ? parseInt(body.discount_percent) : existingProduct.discount_percent,
      original_price: body.original_price !== undefined ? parseFloat(body.original_price) : existingProduct.original_price,
      images: body.images ?? existingProduct.images,
      status: body.status ?? existingProduct.status,
      tags: body.tags ?? existingProduct.tags,
      brand: body.brand ?? existingProduct.brand,
      sku: body.sku ?? existingProduct.sku,
      weight: body.weight ?? existingProduct.weight,
      colors: body.colors ?? existingProduct.colors,
      updated_at: new Date().toISOString(),
    };

    db.products[productIndex] = updatedProduct;

    return NextResponse.json({ data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productIndex = db.products.findIndex(p => p.id === params.id);

  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  db.products.splice(productIndex, 1);

  return NextResponse.json({ success: true });
}
