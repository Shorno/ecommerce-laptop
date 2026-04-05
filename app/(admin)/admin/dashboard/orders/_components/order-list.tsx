"use client";

import { getOrders } from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";
import OrderTable from "@/app/(admin)/admin/dashboard/orders/_components/order-table";
import { useOrderColumns } from "@/app/(admin)/admin/dashboard/orders/_components/order-columns";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";

export default function OrderList() {
  const columns = useOrderColumns();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getOrders,
  });

  console.log(orders)

  if (isLoading) {
    return <TableSkeleton />;
  }

  return <OrderTable columns={columns} data={orders} />;
}
