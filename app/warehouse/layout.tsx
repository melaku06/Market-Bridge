import WarehouseSidebar from '@/components/dashboard/warehouse-sidebar';
import WarehouseHeader from '@/components/dashboard/warehouse-header';

export default function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <WarehouseSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <WarehouseHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
