import { NextRequest, NextResponse } from 'next/server';
import { db, generateId } from '@/lib/mock-db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customer_id = searchParams.get('customer_id');
  const status = searchParams.get('status');

  let requests = [...db.product_requests];
  if (customer_id) requests = requests.filter((r) => r.customer_id === customer_id);
  if (status) requests = requests.filter((r) => r.status === status);

  requests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ data: requests });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRequest = {
      id: generateId('req'),
      customer_id: body.customer_id || 'usr-001',
      customer_email: body.customer_email || 'sarah.johnson@email.com',
      product_name: body.product_name,
      category: body.category || '',
      description: body.description,
      brand: body.brand || '',
      image_url: body.image_url || '',
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    db.product_requests.push(newRequest);
    return NextResponse.json({ data: newRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
