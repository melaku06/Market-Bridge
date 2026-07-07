import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
const adapter = new PrismaPg(new pg.Pool({ connectionString }));
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

// Product images using Pexels stock photos
const IMAGES = {
  electronics: [
    'https://images.pexels.com/photos/336672/pexels-photo-336672.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/336452/pexels-photo-336452.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/265685/pexels-photo-265685.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  fashion: [
    'https://images.pexels.com/photos/996326/pexels-photo-996326.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/336470/pexels-photo-336470.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  home: [
    'https://images.pexels.com/photos/336508/pexels-photo-336508.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5825591/pexels-photo-5825591.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  beauty: [
    'https://images.pexels.com/photos/3321494/pexels-photo-3321494.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/336580/pexels-photo-336580.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3019845/pexels-photo-3019845.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4040548/pexels-photo-4040548.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  sports: [
    'https://images.pexels.com/photos/336556/pexels-photo-336556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/336552/pexels-photo-336552.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1564698/pexels-photo-1564698.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/336652/pexels-photo-336652.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  toys: [
    'https://images.pexels.com/photos/3689587/pexels-photo-3689587.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2280570/pexels-photo-2280570.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1329121/pexels-photo-1329121.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1329124/pexels-photo-1329124.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
};

async function main() {
  console.log('Starting database seeding...\n');
  const passwordHash = await bcrypt.hash('demo123', SALT_ROUNDS);

  // Categories
  console.log('Creating categories...');
  const categories = {
    electronics: await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', is_active: true },
    }),
    fashion: await prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', is_active: true },
    }),
    homeGarden: await prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor and garden supplies', is_active: true },
    }),
    beauty: await prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care', is_active: true },
    }),
    sports: await prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: { name: 'Sports', slug: 'sports', description: 'Sports equipment', is_active: true },
    }),
    toys: await prisma.category.upsert({
      where: { slug: 'toys' },
      update: {},
      create: { name: 'Toys', slug: 'toys', description: 'Toys and games', is_active: true },
    }),
  };
  console.log(`Created ${Object.keys(categories).length} categories\n`);

  // Warehouses
  console.log('Creating warehouses...');
  const warehouses = {
    techHub: await prisma.warehouse.upsert({
      where: { email: 'info@techhub.et' },
      update: {},
      create: {
        name: 'TechHub Ethiopia', owner_name: 'Abebe Kebede', email: 'info@techhub.et',
        phone: '+251911100100', address: 'Bole Sub-City', city: 'Addis Ababa', country: 'Ethiopia',
        business_type: 'Electronics', status: 'active',
      },
    }),
    fashionHouse: await prisma.warehouse.upsert({
      where: { email: 'sales@fashionhouse.et' },
      update: {},
      create: {
        name: 'Fashion House Addis', owner_name: 'Sara Tesfaye', email: 'sales@fashionhouse.et',
        phone: '+251922200200', address: 'Mercato Area', city: 'Addis Ababa', country: 'Ethiopia',
        business_type: 'Fashion', status: 'active',
      },
    }),
    homeLiving: await prisma.warehouse.upsert({
      where: { email: 'info@homeliving.et' },
      update: {},
      create: {
        name: 'Home & Living Store', owner_name: 'Daniel Hailu', email: 'info@homeliving.et',
        phone: '+251933300300', address: 'Cazanchis', city: 'Addis Ababa', country: 'Ethiopia',
        business_type: 'Home Decor', status: 'active',
      },
    }),
    beautyCenter: await prisma.warehouse.upsert({
      where: { email: 'contact@glamour.et' },
      update: {},
      create: {
        name: 'Glamour Beauty Center', owner_name: 'Meron Alemayehu', email: 'contact@glamour.et',
        phone: '+251944400400', address: 'Gotera', city: 'Addis Ababa', country: 'Ethiopia',
        business_type: 'Beauty', status: 'active',
      },
    }),
    sportsPro: await prisma.warehouse.upsert({
      where: { email: 'info@sportspro.et' },
      update: {},
      create: {
        name: 'Sports Pro Equipment', owner_name: 'Yohannes Tadesse', email: 'info@sportspro.et',
        phone: '+251955500500', address: 'Sarbet', city: 'Addis Ababa', country: 'Ethiopia',
        business_type: 'Sports', status: 'active',
      },
    }),
    kidsWorld: await prisma.warehouse.upsert({
      where: { email: 'hello@kidsworld.et' },
      update: {},
      create: {
        name: 'Kids World Toys', owner_name: 'Tigist Haile', email: 'hello@kidsworld.et',
        phone: '+251966600600', address: 'Megenagna', city: 'Addis Ababa', country: 'Ethiopia',
        business_type: 'Toys', status: 'active',
      },
    }),
  };
  console.log(`Created ${Object.keys(warehouses).length} warehouses\n`);

  // Users
  console.log('Creating users...');
  const admin = await prisma.profile.upsert({
    where: { email: 'admin@marketbridge.et' },
    update: {},
    create: { id: randomUUID(), email: 'admin@marketbridge.et', name: 'Dawit Mekonnen', phone: '+251977700700', role: 'admin', status: 'active' },
  });
  await prisma.userCredential.upsert({
    where: { user_id: admin.id },
    update: { password_hash: passwordHash },
    create: { user_id: admin.id, password_hash: passwordHash },
  });

  const customers = [
    { id: randomUUID(), email: 'meseret.bekele@email.et', name: 'Meseret Bekele', phone: '+251988800800' },
    { id: randomUUID(), email: 'fikre.tolossa@email.et', name: 'Fikre Tolossa', phone: '+251988800801' },
    { id: randomUUID(), email: 'helina.girma@email.et', name: 'Helina Girma', phone: '+251988800802' },
    { id: randomUUID(), email: 'bezabih.lemma@email.et', name: 'Bezabih Lemma', phone: '+251988800803' },
    { id: randomUUID(), email: 'selam.asefa@email.et', name: 'Selam Asefa', phone: '+251988800804' },
  ];

  const customerProfiles = [];
  for (const c of customers) {
    const profile = await prisma.profile.upsert({
      where: { email: c.email },
      update: {},
      create: { id: c.id, email: c.email, name: c.name, phone: c.phone, role: 'customer', status: 'active' },
    });
    customerProfiles.push(profile);
    await prisma.userCredential.upsert({
      where: { user_id: profile.id },
      update: { password_hash: passwordHash },
      create: { user_id: profile.id, password_hash: passwordHash },
    });
  }

  const warehouseUsers = [
    { id: randomUUID(), email: 'info@techhub.et', name: 'Abebe Kebede', phone: '+251911100100', warehouse_id: warehouses.techHub.id },
    { id: randomUUID(), email: 'sales@fashionhouse.et', name: 'Sara Tesfaye', phone: '+251922200200', warehouse_id: warehouses.fashionHouse.id },
    { id: randomUUID(), email: 'info@homeliving.et', name: 'Daniel Hailu', phone: '+251933300300', warehouse_id: warehouses.homeLiving.id },
    { id: randomUUID(), email: 'contact@glamour.et', name: 'Meron Alemayehu', phone: '+251944400400', warehouse_id: warehouses.beautyCenter.id },
    { id: randomUUID(), email: 'info@sportspro.et', name: 'Yohannes Tadesse', phone: '+251955500500', warehouse_id: warehouses.sportsPro.id },
    { id: randomUUID(), email: 'hello@kidsworld.et', name: 'Tigist Haile', phone: '+251966600600', warehouse_id: warehouses.kidsWorld.id },
  ];

  for (const w of warehouseUsers) {
    const profile = await prisma.profile.upsert({
      where: { email: w.email },
      update: { warehouse_id: w.warehouse_id },
      create: { id: w.id, email: w.email, name: w.name, phone: w.phone, role: 'warehouse', status: 'active', warehouse_id: w.warehouse_id },
    });
    await prisma.userCredential.upsert({
      where: { user_id: profile.id },
      update: { password_hash: passwordHash },
      create: { user_id: profile.id, password_hash: passwordHash },
    });
  }
  console.log(`Created 1 admin, ${customers.length} customers, ${warehouseUsers.length} warehouse users\n`);

  // Products
  console.log('Creating products...');
  const productDefs = [
    // Electronics
    { name: 'Samsung Galaxy S24 Ultra 256GB', slug: 'samsung-galaxy-s24-ultra', desc: 'Premium smartphone with 200MP camera', price: 145000, wh: warehouses.techHub.id, cat: categories.electronics.id, img: IMAGES.electronics[0], brand: 'Samsung', sku: 'SGS24U-256', tags: ['smartphone', '5G'], colors: ['Black', 'Gray'] },
    { name: 'Apple iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max', desc: 'Most powerful iPhone with A17 Pro chip', price: 165000, wh: warehouses.techHub.id, cat: categories.electronics.id, img: IMAGES.electronics[1], brand: 'Apple', sku: 'IP15PM-256', tags: ['iphone', '5G'], colors: ['Titanium', 'Blue'] },
    { name: 'MacBook Pro 14" M3 Pro', slug: 'macbook-pro-14-m3', desc: 'Professional laptop with M3 Pro chip', price: 195000, wh: warehouses.techHub.id, cat: categories.electronics.id, img: IMAGES.electronics[2], brand: 'Apple', sku: 'MBP14-M3', tags: ['laptop', 'apple'], colors: ['Space Black', 'Silver'] },
    { name: 'Sony WH-1000XM5 Headphones', slug: 'sony-wh1000xm5', desc: 'Premium noise-cancelling headphones', price: 32000, wh: warehouses.techHub.id, cat: categories.electronics.id, img: IMAGES.electronics[3], brand: 'Sony', sku: 'SONY-XM5', tags: ['headphones', 'audio'], colors: ['Black', 'Silver'] },
    { name: 'JBL Flip 6 Speaker', slug: 'jbl-flip-6', desc: 'Waterproof portable Bluetooth speaker', price: 12500, wh: warehouses.techHub.id, cat: categories.electronics.id, img: IMAGES.electronics[4], brand: 'JBL', sku: 'JBL-FLIP6', tags: ['speaker', 'bluetooth'], colors: ['Black', 'Blue', 'Red'] },
    // Fashion
    { name: 'Ethiopian Traditional Dress', slug: 'ethiopian-dress-gold', desc: 'Hand-woven Habesha Kemis with gold embroidery', price: 8500, wh: warehouses.fashionHouse.id, cat: categories.fashion.id, img: IMAGES.fashion[0], brand: 'Fashion House', sku: 'FH-TRAD-01', tags: ['traditional', 'habesha'], colors: ['White/Gold', 'White/Silver'] },
    { name: "Men's Italian Wool Suit", slug: 'mens-wool-suit', desc: 'Premium Italian wool two-piece suit', price: 28000, wh: warehouses.fashionHouse.id, cat: categories.fashion.id, img: IMAGES.fashion[1], brand: 'Fashion House', sku: 'FH-SUIT-01', tags: ['suit', 'formal'], colors: ['Navy', 'Charcoal'] },
    { name: "Women's Elegant Maxi Dress", slug: 'womens-maxi-dress', desc: 'Flowing chiffon maxi dress', price: 6500, wh: warehouses.fashionHouse.id, cat: categories.fashion.id, img: IMAGES.fashion[2], brand: 'Fashion House', sku: 'FH-MAXI-01', tags: ['dress', 'evening'], colors: ['Green', 'Burgundy'] },
    { name: 'Leather Handbag Classic Tote', slug: 'leather-handbag-tote', desc: 'Handcrafted genuine leather tote bag', price: 12000, wh: warehouses.fashionHouse.id, cat: categories.fashion.id, img: IMAGES.fashion[3], brand: 'Fashion House', sku: 'FH-BAG-01', tags: ['bag', 'leather'], colors: ['Brown', 'Black'] },
    { name: "Men's Oxford Shoes", slug: 'mens-oxford-shoes', desc: 'Premium leather Oxford shoes', price: 8500, wh: warehouses.fashionHouse.id, cat: categories.fashion.id, img: IMAGES.fashion[4], brand: 'Fashion House', sku: 'FH-SHOX-01', tags: ['shoes', 'leather'], colors: ['Cognac', 'Black'] },
    // Home
    { name: 'L-Shaped Sectional Sofa', slug: 'l-shaped-sofa-gray', desc: 'Modern sectional with memory foam', price: 45000, wh: warehouses.homeLiving.id, cat: categories.homeGarden.id, img: IMAGES.home[0], brand: 'Home & Living', sku: 'HL-SOFA-01', tags: ['furniture', 'sofa'], colors: ['Gray', 'Beige'] },
    { name: 'Ethiopian Bamboo Coffee Table', slug: 'bamboo-coffee-table', desc: 'Handmade Ethiopian bamboo coffee table', price: 18000, wh: warehouses.homeLiving.id, cat: categories.homeGarden.id, img: IMAGES.home[1], brand: 'Home & Living', sku: 'HL-TABLE-01', tags: ['furniture', 'handmade'], colors: ['Natural', 'Dark Brown'] },
    { name: 'Ethiopian Coffee Set Jebana', slug: 'ethiopian-coffee-set', desc: 'Traditional coffee ceremony set', price: 4500, wh: warehouses.homeLiving.id, cat: categories.homeGarden.id, img: IMAGES.home[2], brand: 'Home & Living', sku: 'HL-COFFEE-01', tags: ['coffee', 'ethiopian'], colors: ['Brown'] },
    { name: 'Smart Air Purifier HEPA', slug: 'smart-air-purifier', desc: 'HEPA air purifier with WiFi', price: 15500, wh: warehouses.homeLiving.id, cat: categories.homeGarden.id, img: IMAGES.home[3], brand: 'Home & Living', sku: 'HL-AIR-01', tags: ['appliance', 'smart'], colors: ['White', 'Black'] },
    { name: 'Egyptian Cotton Bedding Set', slug: 'egyptian-cotton-bedding', desc: '800-thread count Egyptian cotton bedding', price: 12500, wh: warehouses.homeLiving.id, cat: categories.homeGarden.id, img: IMAGES.home[4], brand: 'Home & Living', sku: 'HL-BED-01', tags: ['bedding', 'luxury'], colors: ['White', 'Ivory'] },
    // Beauty
    { name: 'Luxury Skincare Set', slug: 'luxury-skincare-set', desc: 'Anti-aging skincare collection', price: 8500, wh: warehouses.beautyCenter.id, cat: categories.beauty.id, img: IMAGES.beauty[0], brand: 'Glamour Beauty', sku: 'GB-SKIN-01', tags: ['skincare', 'anti-aging'], colors: [] },
    { name: 'Professional Makeup Brush Set', slug: 'makeup-brush-set', desc: '12-piece professional brush set', price: 3200, wh: warehouses.beautyCenter.id, cat: categories.beauty.id, img: IMAGES.beauty[1], brand: 'Glamour Beauty', sku: 'GB-BRUSH-01', tags: ['makeup', 'brushes'], colors: ['Black', 'Rose Gold'] },
    { name: 'Argan Oil Hair Treatment', slug: 'argan-oil-hair', desc: 'Moroccan argan oil hair care set', price: 4800, wh: warehouses.beautyCenter.id, cat: categories.beauty.id, img: IMAGES.beauty[2], brand: 'Glamour Beauty', sku: 'GB-HAIR-01', tags: ['haircare', 'argan'], colors: [] },
    { name: 'Luxury Perfume Collection', slug: 'luxury-perfume-set', desc: 'Set of 3 signature fragrances', price: 9500, wh: warehouses.beautyCenter.id, cat: categories.beauty.id, img: IMAGES.beauty[3], brand: 'Glamour Beauty', sku: 'GB-PERF-01', tags: ['perfume', 'gift'], colors: [] },
    { name: 'Shea Butter Body Lotion', slug: 'shea-butter-lotion', desc: 'Natural shea butter moisturizer', price: 1500, wh: warehouses.beautyCenter.id, cat: categories.beauty.id, img: IMAGES.beauty[4], brand: 'Glamour Beauty', sku: 'GB-LOTION-01', tags: ['lotion', 'natural'], colors: [] },
    // Sports
    { name: 'Adjustable Dumbbell Set 2-24kg', slug: 'adjustable-dumbbell-set', desc: 'Quick-change adjustable dumbbells', price: 35000, wh: warehouses.sportsPro.id, cat: categories.sports.id, img: IMAGES.sports[0], brand: 'Sports Pro', sku: 'SP-DMB-01', tags: ['fitness', 'weights'], colors: ['Black/Red'] },
    { name: 'Premium Yoga Mat', slug: 'premium-yoga-mat', desc: 'Eco-friendly yoga mat with alignment lines', price: 2800, wh: warehouses.sportsPro.id, cat: categories.sports.id, img: IMAGES.sports[1], brand: 'Sports Pro', sku: 'SP-YOGA-01', tags: ['yoga', 'fitness'], colors: ['Purple', 'Blue', 'Green'] },
    { name: 'FIFA Quality Soccer Ball', slug: 'fifa-soccer-ball', desc: 'FIFA certified match soccer ball', price: 4500, wh: warehouses.sportsPro.id, cat: categories.sports.id, img: IMAGES.sports[2], brand: 'Sports Pro', sku: 'SP-BALL-01', tags: ['soccer', 'football'], colors: ['White/Black'] },
    { name: "Men's Running Shoes", slug: 'mens-running-shoes', desc: 'Cushioned running shoes with support', price: 8500, wh: warehouses.sportsPro.id, cat: categories.sports.id, img: IMAGES.sports[3], brand: 'Sports Pro', sku: 'SP-RUN-01', tags: ['running', 'shoes'], colors: ['Black/White', 'Blue'] },
    { name: 'Resistance Band Set 5 Levels', slug: 'resistance-band-set', desc: 'Complete resistance band set', price: 3500, wh: warehouses.sportsPro.id, cat: categories.sports.id, img: IMAGES.sports[4], brand: 'Sports Pro', sku: 'SP-BAND-01', tags: ['fitness', 'resistance'], colors: [] },
    // Toys
    { name: 'Building Blocks 1000 Pieces', slug: 'building-blocks-1000', desc: 'Creative building blocks set', price: 4500, wh: warehouses.kidsWorld.id, cat: categories.toys.id, img: IMAGES.toys[0], brand: 'Kids World', sku: 'KW-BLK-01', tags: ['building', 'educational'], colors: ['Multi-color'] },
    { name: 'RC Racing Car 1:16', slug: 'rc-racing-car', desc: 'High-speed RC racing car', price: 5500, wh: warehouses.kidsWorld.id, cat: categories.toys.id, img: IMAGES.toys[1], brand: 'Kids World', sku: 'KW-RC-01', tags: ['RC', 'cars'], colors: ['Red', 'Blue'] },
    { name: 'Science Kit Chemistry Lab', slug: 'science-kit-chemistry', desc: '50+ experiments chemistry lab', price: 3800, wh: warehouses.kidsWorld.id, cat: categories.toys.id, img: IMAGES.toys[2], brand: 'Kids World', sku: 'KW-SCI-01', tags: ['educational', 'STEM'], colors: [] },
    { name: 'Giant Plush Teddy Bear 90cm', slug: 'plush-teddy-bear', desc: 'Extra soft giant teddy bear', price: 4200, wh: warehouses.kidsWorld.id, cat: categories.toys.id, img: IMAGES.toys[3], brand: 'Kids World', sku: 'KW-TEDDY-01', tags: ['plush', 'teddy'], colors: ['Brown', 'Cream'] },
    { name: 'Wooden Train Set 60 Pieces', slug: 'wooden-train-set', desc: 'Classic wooden train set with railway', price: 6800, wh: warehouses.kidsWorld.id, cat: categories.toys.id, img: IMAGES.toys[4], brand: 'Kids World', sku: 'KW-TRAIN-01', tags: ['wooden', 'train'], colors: ['Natural Wood'] },
  ];

  const products = [];
  for (const p of productDefs) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.desc, base_price: p.price, status: 'published' },
      create: {
        name: p.name, slug: p.slug, description: p.desc, short_description: p.desc,
        warehouse_id: p.wh, category_id: p.cat, base_price: p.price, margin_percent: 15,
        discount_percent: 0, images: [p.img], brand: p.brand, sku: p.sku, tags: p.tags,
        colors: p.colors, status: 'published',
      },
    });
    products.push(product);

    // Create inventory
    const qty = Math.floor(Math.random() * 80) + 20;
    await prisma.inventory.upsert({
      where: { warehouse_id_product_id: { warehouse_id: p.wh, product_id: product.id } },
      update: { quantity: qty, status: qty < 10 ? 'out_of_stock' : qty < 20 ? 'low_stock' : 'in_stock' },
      create: {
        warehouse_id: p.wh, product_id: product.id, quantity: qty, low_stock_threshold: 10,
        status: qty < 10 ? 'out_of_stock' : qty < 20 ? 'low_stock' : 'in_stock',
      },
    });
  }
  console.log(`Created ${products.length} products with inventory\n`);

  // Addresses
  console.log('Creating addresses...');
  for (const profile of customerProfiles) {
    await prisma.address.create({
      data: {
        customer_id: profile.id, label: 'Home', recipient_name: profile.name,
        phone: profile.phone || '', address: 'Bole Sub-City', city: 'Addis Ababa',
        country: 'Ethiopia', is_default: true,
      },
    });
  }

  // Reviews
  console.log('Creating reviews...');
  const reviewData = [
    { customer: customerProfiles[0], product: products[0], rating: 5, comment: 'Amazing phone! Exceptional camera quality.' },
    { customer: customerProfiles[1], product: products[2], rating: 5, comment: 'Best laptop ever. M3 Pro is incredible.' },
    { customer: customerProfiles[2], product: products[5], rating: 5, comment: 'Beautiful traditional dress!' },
    { customer: customerProfiles[3], product: products[12], rating: 4, comment: 'Great coffee set, cups could be larger.' },
    { customer: customerProfiles[4], product: products[15], rating: 5, comment: 'Skincare set transformed my skin!' },
    { customer: customerProfiles[0], product: products[21], rating: 4, comment: 'Excellent yoga mat, helpful alignment lines.' },
    { customer: customerProfiles[1], product: products[25], rating: 5, comment: 'My kids love this building set!' },
    { customer: customerProfiles[2], product: products[3], rating: 5, comment: 'Best noise-cancelling headphones.' },
  ];
  for (const r of reviewData) {
    await prisma.review.create({
      data: {
        customer_id: r.customer.id, product_id: r.product.id,
        customer_name: r.customer.name, product_name: r.product.name,
        rating: r.rating, comment: r.comment,
      },
    });
  }

  // System settings
  console.log('Creating system settings...');
  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default', site_name: 'MarketBridge', site_tagline: 'Ethiopia\'s Premier Marketplace',
      site_email: 'support@marketbridge.et', currency: 'ETB', timezone: 'Africa/Addis_Ababa',
      date_format: 'DD/MM/YYYY', time_format: '24 Hour', items_per_page: 12, site_language: 'English',
    },
  });

  // Margin rules
  console.log('Creating margin rules...');
  const marginDefs = [
    { cat: 'Electronics', wm: 10, pm: 8 },
    { cat: 'Fashion', wm: 15, pm: 10 },
    { cat: 'Home & Garden', wm: 12, pm: 8 },
    { cat: 'Beauty', wm: 18, pm: 12 },
    { cat: 'Sports', wm: 12, pm: 7 },
    { cat: 'Toys', wm: 10, pm: 8 },
  ];
  for (const m of marginDefs) {
    await prisma.marginRule.create({
      data: {
        category_name: m.cat, warehouse_margin: m.wm, platform_margin: m.pm,
        total_margin: m.wm + m.pm, is_active: true,
      },
    });
  }

  console.log('\n========================================');
  console.log('SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  console.log('\nDemo Accounts (password: demo123):');
  console.log('  Admin: admin@marketbridge.et');
  console.log('  Customers:');
  customers.forEach(c => console.log(`    - ${c.email}`));
  console.log('  Warehouses:');
  warehouseUsers.forEach(w => console.log(`    - ${w.email}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
