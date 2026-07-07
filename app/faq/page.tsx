import Link from 'next/link';
import { ChevronRight, HelpCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FAQAccordion from '@/components/faq/faq-accordion';

export const metadata = {
  title: 'Frequently Asked Questions | MarketBridge',
  description: 'Find answers to common questions about orders, payments, shipping, returns, and more on MarketBridge.',
};

const faqCategories = [
  {
    category: 'Orders & Shopping',
    questions: [
      {
        question: 'How do I place an order?',
        answer: 'Browse products on our website, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in to complete your purchase. Follow the prompts to enter your delivery address and payment information.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it. After that, the order enters processing and cannot be changed. Contact our support team immediately if you need to make changes.',
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order is shipped, you\'ll receive a tracking link via email and SMS. You can also track your order from your account dashboard under "My Orders".',
      },
      {
        question: 'What if an item is out of stock?',
        answer: 'If an item is out of stock, you can request it through our Product Request page. We\'ll notify you when it becomes available from one of our verified warehouses.',
      },
    ],
  },
  {
    category: 'Payments & Pricing',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Telebirr, CBE Birr, bank transfers, and cash on delivery (COD) for orders under 5,000 Br. All online payments are processed securely.',
      },
      {
        question: 'Is the pricing in Ethiopian Birr?',
        answer: 'Yes, all prices on MarketBridge are displayed in Ethiopian Birr (ETB). The price you see includes the base price, applicable margins, and any active discounts.',
      },
      {
        question: 'Why do prices vary between warehouses?',
        answer: 'Different warehouses set their own base prices. MarketBridge applies a transparent margin system to ensure fair pricing while supporting local sellers.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'Yes, we offer full refunds for defective products or incorrect deliveries. Refunds are processed within 5-7 business days after we receive and verify the returned item.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        question: 'Where do you deliver?',
        answer: 'We currently deliver to Addis Ababa and major cities including Dire Dawa, Hawassa, Bahir Dar, Mekelle, Gondar, Jimma, and Adama. Coverage is expanding to more cities.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Addis Ababa: 1-2 business days. Major cities: 2-4 business days. Remote areas: 5-7 business days. Delivery times may vary based on product availability.',
      },
      {
        question: 'What are the shipping costs?',
        answer: 'Orders over 500 Br qualify for free shipping within Addis Ababa. Standard shipping rates apply for orders under 500 Br and for deliveries outside Addis Ababa.',
      },
      {
        question: 'What if my delivery is delayed?',
        answer: 'Contact our support team with your order number. We\'ll investigate the delay and keep you updated. You may be eligible for a shipping refund if the delay is significant.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most products. Items must be unused, in original packaging, and accompanied by proof of purchase. Some products like perishables and personalized items cannot be returned.',
      },
      {
        question: 'How do I return a product?',
        answer: 'Log into your account, go to "My Orders," select the order, and click "Request Return." Follow the instructions to print a return label or schedule a pickup. Returns are free for defective items.',
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method or as store credit upon request.',
      },
    ],
  },
  {
    category: 'Account & Security',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Create Account" on the login page. Enter your name, email, phone number, and create a password. You\'ll receive a verification email to activate your account.',
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click "Forgot Password" on the login page. Enter your registered Telegram username to receive a reset code via Telegram. Follow the instructions to set a new password.',
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we use industry-standard encryption and security practices to protect your data. We never share your personal information with third parties without your consent.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team to request account deletion. We\'ll process your request within 14 days. Note that order history and transaction records may be retained for legal compliance.',
      },
    ],
  },
  {
    category: 'Sellers & Warehouses',
    questions: [
      {
        question: 'How can I become a seller on MarketBridge?',
        answer: 'Contact us through the Contact page selecting "Become a Seller" as the subject. Our team will review your application and guide you through the verification process.',
      },
      {
        question: 'What are the requirements for warehouses?',
        answer: 'Warehouses must be registered businesses in Ethiopia, have a physical location, maintain quality standards, and agree to our seller terms. We conduct verification before approval.',
      },
      {
        question: 'What fees do sellers pay?',
        answer: 'Sellers pay a small commission on each sale. The exact rate varies by category. We maintain transparent pricing with no hidden fees. Contact us for detailed rate cards.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">FAQ</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about orders, payments, shipping, and more. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqCategories.map((category) => (
              <div key={category.category} className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <FAQAccordion questions={category.questions} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6">Our support team is here to help you with any questions or concerns.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </Link>
              <a href="mailto:support@marketbridge.et">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Email Us
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
