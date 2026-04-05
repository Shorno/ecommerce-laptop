"use client";

import getProducts from "@/app/(admin)/admin/dashboard/products/actions/get-products";
import ProductTable from "@/app/(admin)/admin/dashboard/products/_components/product-table";
import { useProductColumns } from "@/app/(admin)/admin/dashboard/products/_components/product-columns";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";

export default function ProductList() {
  const columns = useProductColumns();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return <ProductTable columns={columns} data={products} />;
}
