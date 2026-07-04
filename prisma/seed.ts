import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(new pg.Pool({ connectionString: process.env.DATABASE_URL }));
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  console.log('Seeding database...');

  // Password hash for demo123
  const passwordHash = await bcrypt.hash('demo123', SALT_ROUNDS);

  // Create demo categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home decor and garden supplies',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Beauty and personal care products',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and gear',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'toys' },
      update: {},
      create: {
        name: 'Toys',
        slug: 'toys',
        description: 'Toys and games',
        is_active: true,
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create demo warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { email: 'warehouse@demo.com' },
    update: {},
    create: {
      id: 'ccccccea-cccc-cccc-cccc-cccccccccccc',
      name: 'Demo Warehouse',
      owner_name: 'Demo Warehouse Owner',
      email: 'warehouse@demo.com',
      phone: '+251911123456',
      address: '123 Demo Street',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      business_type: 'General Trading',
      status: 'active',
    },
  });

  console.log('Created demo warehouse');

  // Create demo users
  const admin = await prisma.profile.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: 'admin@demo.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
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

  const customer = await prisma.profile.upsert({
    where: { email: 'customer@demo.com' },
    update: {},
    create: {
      id: 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      email: 'customer@demo.com',
      name: 'Demo Customer',
      role: 'customer',
      status: 'active',
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

  const warehouseUser = await prisma.profile.upsert({
    where: { email: 'warehouse@demo.com' },
    update: {},
    create: {
      id: 'cccccceb-cccc-cccc-cccc-cccccccccccc',
      email: 'warehouse@demo.com',
      name: 'Demo Warehouse User',
      role: 'warehouse',
      status: 'active',
      warehouse_id: warehouse.id,
    },
  });

  await prisma.userCredential.upsert({
    where: { user_id: warehouseUser.id },
    update: { password_hash: passwordHash },
    create: {
      user_id: warehouseUser.id,
      password_hash: passwordHash,
    },
  });

  console.log('Demo users created successfully!');

  // Create default margin rules
  const marginRules = [
    { category_name: 'Electronics', warehouse_margin: 10, platform_margin: 8 },
    { category_name: 'Fashion', warehouse_margin: 12, platform_margin: 8 },
    { category_name: 'Beauty', warehouse_margin: 15, platform_margin: 10 },
    { category_name: 'Home & Garden', warehouse_margin: 10, platform_margin: 5 },
    { category_name: 'Sports', warehouse_margin: 10, platform_margin: 6 },
    { category_name: 'Toys', warehouse_margin: 8, platform_margin: 7 },
  ];

  for (const rule of marginRules) {
    await prisma.marginRule.upsert({
      where: { id: `margin-${rule.category_name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `margin-${rule.category_name.toLowerCase().replace(/\s+/g, '-')}`,
        category_name: rule.category_name,
        warehouse_margin: rule.warehouse_margin,
        platform_margin: rule.platform_margin,
        total_margin: rule.warehouse_margin + rule.platform_margin,
        is_active: true,
      },
    });
  }

  console.log('Margin rules created');

  // Create default system settings
  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      site_name: 'MarketBridge',
      site_tagline: 'Multi-Vendor Marketplace',
      site_email: 'support@marketbridge.com',
      currency: 'ETB',
      timezone: 'Africa/Addis_Ababa',
      date_format: 'DD/MM/YYYY',
      time_format: '24 Hour',
      items_per_page: 10,
      site_language: 'English',
    },
  });

  console.log('System settings created');

  console.log('\n========================================');
  console.log('Database seeding completed!');
  console.log('========================================');
  console.log('\nDemo Accounts:');
  console.log('  Admin:     admin@demo.com / demo123');
  console.log('  Customer:  customer@demo.com / demo123');
  console.log('  Warehouse: warehouse@demo.com / demo123');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
