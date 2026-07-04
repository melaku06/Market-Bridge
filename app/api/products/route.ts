import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db-service';
import { productCreateSchema, generateSlug } from '@/lib/validations/product';
import { invalidateProducts } from '@/lib/cached-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params = {
      category_id: searchParams.get('category_id') || searchParams.get('category') || undefined,
      warehouse_id: searchParams.get('warehouse_id') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      brand: searchParams.get('brand') || undefined,
      sort_by: searchParams.get('sort_by') || 'created_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const { products, total } = await getProducts(params);

    return NextResponse.json({
      data: products,
      pagination: {
        total,
        limit: params.limit,
        offset: params.offset,
        has_more: params.offset + params.limit < total
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = productCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Generate slug if not provided
    const slug = generateSlug(data.name);

    // Prepare product data with proper Decimal conversion
    const productData: any = {
      name: data.name,
      slug,
      description: data.description,
      short_description: data.short_description,
      base_price: data.base_price,
      margin_percent: data.margin_percent,
      discount_percent: data.discount_percent ?? 0,
      images: data.images,
      tags: data.tags,
      brand: data.brand,
      sku: data.sku,
      weight: data.weight,
      colors: data.colors,
      status: 'pending',
      warehouse: { connect: { id: body.warehouse_id || 'ccccccea-cccc-cccc-cccc-cccccccccccc' } },
    };

    // Only add category if provided
    if (data.category_id) {
      productData.category = { connect: { id: data.category_id } };
    }

    // Create product
    const product = await createProduct(productData);

    // Create initial inventory if quantity provided
    if (data.quantity && data.quantity > 0) {
      const { prisma } = await import('@/lib/prisma');
      await prisma.inventory.create({
        data: {
          warehouse_id: product.warehouse_id,
          product_id: product.id,
          quantity: data.quantity,
        }
      });
    }

    invalidateProducts();
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
