import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
  title: 'Terms of Service | MarketBridge',
  description: 'Read the terms and conditions governing your use of MarketBridge services.',
};

export default function TermsPage() {
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
              <span className="text-gray-900 font-medium">Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-sm text-gray-500">Last updated: January 2024</p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                <p className="text-sm text-blue-800 m-0">
                  By accessing or using MarketBridge, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By creating an account or using MarketBridge services, you confirm that you are at least 18 years old and have the legal capacity to enter into these terms. You agree to comply with all applicable laws and these terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                MarketBridge is an online marketplace that connects sellers (warehouses) with buyers (customers) in Ethiopia. We provide:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>A platform for browsing and purchasing products</li>
                <li>Order processing and delivery coordination</li>
                <li>Secure payment processing</li>
                <li>Customer support and dispute resolution</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Account Registration</h2>
              <p className="text-gray-600 mb-4">To use certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your password and account</li>
                <li>Not share your account with others</li>
                <li>Promptly notify us of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Purchases and Payments</h2>
              <p className="text-gray-600 mb-4">When you make a purchase:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>You agree to pay the total price including shipping and applicable taxes</li>
                <li>All prices are in Ethiopian Birr (ETB)</li>
                <li>Payment must be completed before order processing begins</li>
                <li>Cash on delivery (COD) orders require payment upon delivery</li>
                <li>We reserve the right to cancel orders suspected of fraud</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Product Information</h2>
              <p className="text-gray-600 mb-6">
                While we strive for accuracy, product descriptions, images, and prices are provided by sellers. We do not warrant that descriptions are error-free. If a product differs significantly from its description, you may return it under our return policy.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Delivery and Shipping</h2>
              <p className="text-gray-600 mb-4">Delivery terms are as follows:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>We deliver to addresses within our service areas</li>
                <li>You must be available to receive the package or designate someone to receive it</li>
                <li>Risk of loss transfers to you upon delivery</li>
                <li>Failed delivery attempts may incur additional fees</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Returns and Refunds</h2>
              <p className="text-gray-600 mb-6">
                Our 30-day return policy applies to most products. Products must be unused, in original packaging, and accompanied by proof of purchase. Certain items cannot be returned. Refunds are processed within 5-7 business days after we receive and verify the return.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Prohibited Activities</h2>
              <p className="text-gray-600 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Provide false information during registration or transactions</li>
                <li>Use the platform for illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Scrape or collect user data without permission</li>
                <li>Infringe on intellectual property rights</li>
                <li>Engage in fraudulent transactions</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600 mb-6">
                All content on MarketBridge, including logos, text, images, and software, is owned by MarketBridge or our licensors. You may not reproduce, distribute, or create derivative works without express written permission.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                To the fullest extent permitted by law, MarketBridge shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the amount paid by you for the transaction giving rise to the claim.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Dispute Resolution</h2>
              <p className="text-gray-600 mb-6">
                Any dispute arising from these terms shall be resolved through negotiation. If negotiation fails, disputes shall be submitted to the appropriate courts in Addis Ababa, Ethiopia.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Termination</h2>
              <p className="text-gray-600 mb-6">
                We may suspend or terminate your account at any time for violation of these terms or for any other reason. You may close your account at any time. Upon termination, your right to use the platform ceases immediately.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We may modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
              <p className="text-gray-600 mb-6">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-gray-700 m-0">
                  <strong>MarketBridge Legal Team</strong><br />
                  Email: legal@marketbridge.et<br />
                  Phone: +251 91 123 4567<br />
                  Address: Bole Sub-City, Woreda 03, Addis Ababa, Ethiopia
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
