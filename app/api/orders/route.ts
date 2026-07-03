import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db-service';
import { orderCreateSchema, generateOrderNumber } from '@/lib/validations/order';
import prisma from '@/lib/prisma';
import { invalidateOrders, invalidateProducts } from '@/lib/cached-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || undefined;
    const customer_id = searchParams.get('customer_id') || undefined;
    const warehouse_id = searchParams.get('warehouse_id') || undefined;
    const payment_status = searchParams.get('payment_status') || undefined;
    const search = searchParams.get('search') || undefined;
    const start_date = searchParams.get('start_date') ? new Date(searchParams.get('start_date')!) : undefined;
    const end_date = searchParams.get('end_date') ? new Date(searchParams.get('end_date')!) : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { orders, total } = await getOrders({
      status,
      customer_id,
      warehouse_id,
      payment_status,
      search,
      start_date,
      end_date,
      limit,
      offset,
    });

    return NextResponse.json({
      data: orders,
      pagination: { total, limit, offset, has_more: offset + limit < total }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = orderCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Get customer info from body explicitly (not in schema)
    const customerId = body.customer_id;
    if (!customerId) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 });
    }

    const customer = await prisma.profile.findUnique({
      where: { id: customerId },
    });

    // Get address
    const address = await prisma.address.findUnique({
      where: { id: data.shipping_address_id },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 400 });
    }

    // Batch fetch all products in a single query (fixes N+1)
    const productIds = data.items.map((item) => item.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        base_price: true,
        margin_percent: true,
        images: true,
        warehouse_id: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products exist
    for (const item of data.items) {
      if (!productMap.has(item.product_id)) {
        return NextResponse.json(
          { error: `Product ${item.product_id} not found` },
          { status: 400 }
        );
      }
    }

    // Calculate totals from batch-fetched products
    let subtotal = 0;
    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.product_id)!;
      const unitPrice = Number(product.base_price) * (1 + Number(product.margin_percent) / 100);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        product_id: item.product_id,
        product_name: product.name,
        product_image: product.images[0] || null,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        color: item.color,
        size: item.size,
      };
    });

    const shippingFee = 50; // Fixed shipping
    const total = subtotal + shippingFee;

    // Get warehouse from first product (already fetched above)
    const firstProduct = products[0];
    if (!firstProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 400 });
    }

    const order = await createOrder({
      order_number: generateOrderNumber(),
      customer: { connect: { id: customer?.id } },
      warehouse: { connect: { id: firstProduct.warehouse_id } },
      customer_name: customer?.name || 'Guest',
      customer_email: customer?.email || 'guest@example.com',
      customer_phone: customer?.phone,
      subtotal,
      shipping_fee: shippingFee,
      discount: 0,
      tax: 0,
      total,
      shipping_address: address.address,
      shipping_city: address.city,
      shipping_method: data.shipping_method,
      payment_method: data.payment_method,
      payment_status: data.payment_method === 'cod' ? 'cod' : 'pending',
      status: 'pending',
      notes: data.notes,
      items: {
        create: orderItems,
      },
    });

    // Invalidate caches after order creation
    invalidateOrders();
    invalidateProducts();

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
