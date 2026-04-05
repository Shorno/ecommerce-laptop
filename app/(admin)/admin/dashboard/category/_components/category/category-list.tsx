"use client";

import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import CategoryTable from "@/app/(admin)/admin/dashboard/category/_components/category/category-table";
import { useCategoryColumns } from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";

export default function CategoryList() {
  const columns = useCategoryColumns();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return <CategoryTable columns={columns} data={categories} />;
}