"use client"

import {useQuery} from "@tanstack/react-query"
import {getInventory} from "@/app/(admin)/admin/dashboard/inventory/actions/inventory-actions"
import InventoryTable from "@/app/(admin)/admin/dashboard/inventory/_components/inventory-table"
import {inventoryColumns} from "@/app/(admin)/admin/dashboard/inventory/_components/inventory-columns"
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton"

export default function InventoryList() {
    const {data: inventory = [], isLoading} = useQuery({
        queryKey: ["admin-inventory"],
        queryFn: getInventory,
    })

    if (isLoading) {
        return <TableSkeleton columns={8} rows={8}/>
    }

    const stats = {
        total: inventory.length,
        outOfStock: inventory.filter(i => i.stock === 0 && i.inStock).length,
        lowStock: inventory.filter(i => i.stock > 0 && i.stock <= 5 && i.inStock).length,
        inStock: inventory.filter(i => i.stock > 5 && i.inStock).length,
    }

    return <InventoryTable columns={inventoryColumns} data={inventory} stats={stats}/>
}
