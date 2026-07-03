import { NextRequest, NextResponse } from 'next/server';
import { getProductRequestById, updateProductRequest } from '@/lib/db-service';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productRequest = await getProductRequestById(id);

    if (!productRequest) {
      return NextResponse.json({ error: 'Product request not found' }, { status: 404 });
    }

    return NextResponse.json({ data: productRequest });
  } catch (error) {
    console.error('Error fetching product request:', error);
    return NextResponse.json({ error: 'Failed to fetch product request' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const productRequest = await updateProductRequest(id, body);

    return NextResponse.json({ data: productRequest });
  } catch (error) {
    console.error('Error updating product request:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Product request not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update product request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.productRequest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product request:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Product request not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete product request' }, { status: 500 });
  }
}
