import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { userQuerySchema } from '@/lib/validations/user';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const result = userQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      role: searchParams.get('role'),
      status: searchParams.get('status'),
      search: searchParams.get('search'),
    });

    const params = result.success ? result.data : { page: 1, limit: 20 };

    const where: any = {};
    if (params.role) where.role = params.role;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        include: {
          warehouse: { select: { id: true, name: true } },
          credentials: false,
        },
      }),
      prisma.profile.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        limit: params.limit,
        offset: (params.page - 1) * params.limit,
        has_more: params.page * params.limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registerUser } = await import('@/lib/auth/db-service');

    const result = await registerUser({
      email: body.email,
      password: body.password,
      name: body.name,
      phone: body.phone,
      role: body.role,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
