'use client';

import Link from 'next/link';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth/auth-store';
import { getDashboardPath } from '@/lib/auth/types';

export default function ForbiddenPage() {
  const user = useAuthStore((s) => s.user);
  const dashboardPath = user ? getDashboardPath(user.role) : '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-6">
          You don&apos;t have permission to access this page. If you believe this is an error, please contact support.
        </p>
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
