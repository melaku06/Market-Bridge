import { ProductGridSkeleton } from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="h-16 bg-white border-b border-gray-100" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  );
}
