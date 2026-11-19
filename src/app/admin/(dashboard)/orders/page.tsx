import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { OrdersTable } from "@/components/admin/orders-table";
import { getOrders } from "@/lib/db";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [orders, query] = await Promise.all([getOrders(), searchParams]);
  return (
    <div>
      <AdminPageHeader
        eyebrow="Operations"
        title="Orders"
        description="Review orders, update fulfilment and confirm payments only after they have been verified."
      />
      <div className="mt-5">
        <Flash saved={query.saved} />
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
