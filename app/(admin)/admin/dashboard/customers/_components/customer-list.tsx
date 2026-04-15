"use client"

import {getCustomers} from "@/app/(admin)/admin/dashboard/customers/actions/get-customers"
import CustomerTable from "@/app/(admin)/admin/dashboard/customers/_components/customer-table"
import {customerColumns} from "@/app/(admin)/admin/dashboard/customers/_components/customer-columns"
import {useQuery} from "@tanstack/react-query"
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton"

export default function CustomerList() {
    const {data: customers = [], isLoading} = useQuery({
        queryKey: ["admin-customers"],
        queryFn: getCustomers,
    })

    if (isLoading) {
        return <TableSkeleton columns={7} rows={6}/>
    }

    return <CustomerTable columns={customerColumns} data={customers}/>
}
