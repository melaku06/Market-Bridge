import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const passwordHash = await bcrypt.hash('demo123', SALT_ROUNDS);

  // Admin user
  const admin = await prisma.profile.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: 'admin@demo.com',
      name: 'Admin User',
      role: 'admin',
      is_active: true,
    },
  });

  await prisma.userCredential.upsert({
    where: { user_id: admin.id },
    update: { password_hash: passwordHash },
    create: {
      user_id: admin.id,
      password_hash: passwordHash,
    },
  });

  // Customer user
  const customer = await prisma.profile.upsert({
    where: { email: 'customer@demo.com' },
    update: {},
    create: {
      id: 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      email: 'customer@demo.com',
      name: 'Demo Customer',
      role: 'customer',
      is_active: true,
    },
  });

  await prisma.userCredential.upsert({
    where: { user_id: customer.id },
    update: { password_hash: passwordHash },
    create: {
      user_id: customer.id,
      password_hash: passwordHash,
    },
  });

  // Warehouse user
  const warehouse = await prisma.profile.upsert({
    where: { email: 'warehouse@demo.com' },
    update: {},
    create: {
      id: 'ccccccea-cccc-cccc-cccc-cccccccccccc',
      email: 'warehouse@demo.com',
      name: 'Demo Warehouse',
      role: 'warehouse',
      is_active: true,
    },
  });

  await prisma.userCredential.upsert({
    where: { user_id: warehouse.id },
    update: { password_hash: passwordHash },
    create: {
      user_id: warehouse.id,
      password_hash: passwordHash,
    },
  });

  console.log('Demo users created successfully!');
  console.log('Email: admin@demo.com / Password: demo123');
  console.log('Email: customer@demo.com / Password: demo123');
  console.log('Email: warehouse@demo.com / Password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
