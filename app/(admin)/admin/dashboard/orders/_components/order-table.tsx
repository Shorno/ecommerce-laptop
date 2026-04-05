"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function OrderTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const t = useTranslations('orders');
    const tCommon = useTranslations('common');

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4 gap-2">
                <Input
                    placeholder={t('filterByOrderNumber')}
                    value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("orderNumber")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                        table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allStatus')}</SelectItem>
                        <SelectItem value="pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
                        <SelectItem value="processing">{t('status.processing')}</SelectItem>
                        <SelectItem value="shipped">{t('status.shipped')}</SelectItem>
                        <SelectItem value="delivered">{t('status.delivered')}</SelectItem>
                        <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                        <SelectItem value="refunded">{t('status.refunded')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t('noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    {t('totalOrders')}: {data.length}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {tCommon('previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {tCommon('next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
