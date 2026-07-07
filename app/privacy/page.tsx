import Link from 'next/link';
import { ChevronRight, Shield } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
  title: 'Privacy Policy | MarketBridge',
  description: 'Learn how MarketBridge collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
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
              <span className="text-gray-900 font-medium">Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-sm text-gray-500">Last updated: January 2024</p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                <p className="text-sm text-blue-800 m-0">
                  At MarketBridge, we take your privacy seriously. This policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account.</li>
                <li><strong>Profile Information:</strong> Delivery addresses, Telegram username (optional), and profile photo.</li>
                <li><strong>Transaction Data:</strong> Order history, payment information, and delivery preferences.</li>
                <li><strong>Communications:</strong> Messages you send to sellers or our support team.</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about orders, promotions, and updates</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and user experience</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We share your information only in these circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>With Sellers:</strong> Your name, delivery address, and contact information are shared with the seller when you place an order.</li>
                <li><strong>Service Providers:</strong> We work with trusted partners for payment processing, delivery, and analytics who are bound by confidentiality agreements.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-6">
                We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
              <p className="text-gray-600 mb-6">
                We retain your personal information for as long as your account is active or as needed to provide services. Transaction records may be retained for up to 7 years for legal and accounting purposes.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Access and update your personal information through your account settings</li>
                <li>Request deletion of your account (some data may be retained for legal compliance)</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your personal data</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-6">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings in your browser, but disabling cookies may affect some features.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-6">
                Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 mb-6">
                We may update this policy periodically. We will notify you of significant changes via email or a prominent notice on our website. Continued use of our platform after changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-gray-700 m-0">
                  <strong>MarketBridge Privacy Team</strong><br />
                  Email: privacy@marketbridge.et<br />
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
