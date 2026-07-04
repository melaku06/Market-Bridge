export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Out of Stock' | 'Running Low' | 'Low Stock';
  image: string;
  barcode?: string;
  brand?: string;
  shortDescription?: string;
  detailedDescription?: string;
  reserved?: number;
  available?: number;
}

export interface Order {
  id: string;
  customer: string;
  items: number;
  amount: number;
  payment: string;
  status: 'New' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: 'Orders' | 'Inventory' | 'System' | 'Promotions';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-10000MS',
    category: 'Electronics',
    price: 199.99,
    stock: 24,
    status: 'Active',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    barcode: '1234567890123',
    brand: 'Sony',
    shortDescription: 'Industry-leading noise canceling wireless headphones.',
    detailedDescription: 'Experience premium sound quality with advanced noise canceling technology and all-day comfort.',
    reserved: 6,
    available: 18,
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    sku: 'SW-5000',
    category: 'Electronics',
    price: 149.99,
    stock: 15,
    status: 'Low Stock',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    barcode: '2345678901234',
    brand: 'Apple',
    reserved: 4,
    available: 11,
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    sku: 'BS-200',
    category: 'Electronics',
    price: 59.99,
    stock: 8,
    status: 'Active',
    image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    reserved: 2,
    available: 6,
  },
  {
    id: '4',
    name: 'Premium Backpack',
    sku: 'PB-001',
    category: 'Bags',
    price: 89.99,
    stock: 32,
    status: 'Active',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    reserved: 5,
    available: 27,
  },
  {
    id: '5',
    name: 'Running Shoes',
    sku: 'RS-100',
    category: 'Footwear',
    price: 129.99,
    stock: 18,
    status: 'Active',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    reserved: 3,
    available: 15,
  },
  {
    id: '6',
    name: 'Gaming Mouse',
    sku: 'GM-300',
    category: 'Electronics',
    price: 49.99,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    reserved: 0,
    available: 0,
  },
  {
    id: '7',
    name: 'Mechanical Keyboard',
    sku: 'MK-800',
    category: 'Electronics',
    price: 79.99,
    stock: 5,
    status: 'Running Low',
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    reserved: 1,
    available: 4,
  },
  {
    id: '8',
    name: 'Portable Charger',
    sku: 'PC-10000',
    category: 'Electronics',
    price: 29.99,
    stock: 6,
    status: 'Low Stock',
    image: 'https://images.pexels.com/photos/4526426/pexels-photo-4526426.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    reserved: 1,
    available: 5,
  },
];

export const orders: Order[] = [
  { id: '#ORD-10245', customer: 'Sarah Johnson', items: 2, amount: 129.99, payment: 'Paid', status: 'New', date: 'May 31, 2024' },
  { id: '#ORD-10244', customer: 'Michael Brown', items: 2, amount: 69.50, payment: 'Paid', status: 'Processing', date: 'May 31, 2024' },
  { id: '#ORD-10243', customer: 'Emily Davis', items: 1, amount: 199.99, payment: 'Paid', status: 'Processing', date: 'May 30, 2024' },
  { id: '#ORD-10242', customer: 'David Wilson', items: 4, amount: 245.00, payment: 'COD', status: 'New', date: 'May 30, 2024' },
  { id: '#ORD-10241', customer: 'Jessica Taylor', items: 2, amount: 75.00, payment: 'Paid', status: 'Shipped', date: 'May 29, 2024' },
  { id: '#ORD-10240', customer: 'James Anderson', items: 1, amount: 45.99, payment: 'Paid', status: 'Delivered', date: 'May 29, 2024' },
  { id: '#ORD-10239', customer: 'Olivia Martinez', items: 3, amount: 159.99, payment: 'Paid', status: 'Cancelled', date: 'May 28, 2024' },
  { id: '#ORD-10238', customer: 'Daniel Thomas', items: 2, amount: 90.00, payment: 'COD', status: 'Processing', date: 'May 28, 2024' },
  { id: '#ORD-10237', customer: 'Sophie Lee', items: 1, amount: 29.99, payment: 'Paid', status: 'Delivered', date: 'May 27, 2024' },
  { id: '#ORD-10236', customer: 'William Garcia', items: 5, amount: 259.99, payment: 'Paid', status: 'Shipped', date: 'May 27, 2024' },
];

export const notifications: Notification[] = [
  { id: '1', type: 'Orders', title: 'New Order Received', message: 'You have received a new order #ORD-10245 from Sarah Johnson.', time: 'Just now', read: false },
  { id: '2', type: 'Inventory', title: 'Low Stock Alert', message: 'Smart Watch Series 5 is low on stock. Only 4 units remaining.', time: '15 minutes ago', read: false },
  { id: '3', type: 'Orders', title: 'Order Shipped', message: 'Order #ORD-10241 has been shipped successfully.', time: '1 hour ago', read: false },
  { id: '4', type: 'Orders', title: 'Payment Received', message: 'Payment of $349.00 received for order #ORD-10240.', time: '3 hours ago', read: true },
  { id: '5', type: 'System', title: 'New Product Approved', message: 'Your product "Bluetooth Speaker" has been approved.', time: '3 hours ago', read: true },
  { id: '6', type: 'Inventory', title: 'Inventory Updated', message: 'Inventory for Wireless Headphones has been updated.', time: '6 hours ago', read: true },
  { id: '7', type: 'System', title: 'System Maintenance', message: 'System maintenance scheduled on June 5, 2024 from 2:00 AM to 4:00 AM.', time: '1 day ago', read: true },
  { id: '8', type: 'Promotions', title: 'Promotional Offer', message: 'New promotional campaign is live. Check it out now!', time: '2 days ago', read: true },
];
