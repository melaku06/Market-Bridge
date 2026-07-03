export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="h-16 bg-white border-b border-gray-100" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 w-1/3 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
