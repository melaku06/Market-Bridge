import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get('type');
  const warehouse_id = searchParams.get('warehouse_id');

  let analytics = { ...db.analytics };

  // Filter by warehouse if specified
  if (warehouse_id) {
    const warehouseOrders = db.orders.filter(o => o.warehouse_id === warehouse_id);
    const warehouseProducts = db.products.filter(p => p.warehouse_id === warehouse_id);

    analytics = {
      ...analytics,
      revenue: {
        today: warehouseOrders.filter(o => {
          const orderDate = new Date(o.created_at).toDateString();
          return orderDate === new Date().toDateString();
        }).reduce((sum, o) => sum + o.total, 0),
        week: warehouseOrders.reduce((sum, o) => sum + o.total, 0) * 0.2,
        month: warehouseOrders.reduce((sum, o) => sum + o.total, 0) * 0.6,
        total: warehouseOrders.reduce((sum, o) => sum + o.total, 0),
      },
      orders: {
        total: warehouseOrders.length,
        active: warehouseOrders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
        completed: warehouseOrders.filter(o => o.status === 'delivered').length,
        cancelled: warehouseOrders.filter(o => o.status === 'cancelled').length,
      },
      products: {
        total: warehouseProducts.length,
        published: warehouseProducts.filter(p => p.status === 'published').length,
        pending: warehouseProducts.filter(p => p.status === 'pending').length,
        out_of_stock: db.inventory.filter(i => i.warehouse_id === warehouse_id && i.status === 'out_of_stock').length,
      },
    };
  }

  // Return specific analytics type
  if (type && analytics[type as keyof typeof analytics]) {
    return NextResponse.json({ data: { [type]: analytics[type as keyof typeof analytics] } });
  }

  return NextResponse.json({ data: analytics });
}
