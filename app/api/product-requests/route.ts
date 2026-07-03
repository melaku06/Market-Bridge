import { NextRequest, NextResponse } from 'next/server';
import { getProductRequests, createProductRequest } from '@/lib/db-service';
import { productRequestCreateSchema } from '@/lib/validations/common';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const customer_id = searchParams.get('customer_id') || undefined;
    const status = searchParams.get('status') || undefined;

    const requests = await getProductRequests({ customer_id, status });

    return NextResponse.json({ data: requests });
  } catch (error) {
    console.error('Error fetching product requests:', error);
    return NextResponse.json({ error: 'Failed to fetch product requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = productRequestCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    const productRequest = await createProductRequest({
      customer: { connect: { id: body.customer_id } },
      customer_email: body.customer_email,
      product_name: data.product_name,
      description: data.description,
      category: data.category,
      brand: data.brand,
      image_url: data.image_url,
      status: 'pending',
    });

    return NextResponse.json({ data: productRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating product request:', error);
    return NextResponse.json({ error: 'Failed to create product request' }, { status: 500 });
  }
}
