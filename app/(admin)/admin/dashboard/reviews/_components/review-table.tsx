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

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
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
import {Badge} from "@/components/ui/badge"
import {Star, Clock, Check} from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    stats: { total: number; pending: number; approved: number }
}

export default function ReviewTable<TData, TValue>({
                                                       columns,
                                                       data,
                                                       stats,
                                                   }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = React.useState("")

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
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        initialState: {
            pagination: {pageSize: 15},
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Summary pills */}
            <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card">
                    <Star className="h-4 w-4 text-muted-foreground shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight">{stats.total}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">Total Reviews</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600 shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight text-yellow-600">{stats.pending}</p>
                        <p className="text-[11px] font-medium text-yellow-600/70">Pending</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50">
                    <Check className="h-4 w-4 text-green-600 shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight text-green-600">{stats.approved}</p>
                        <p className="text-[11px] font-medium text-green-600/70">Approved</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-2">
                <Input
                    placeholder="Search by product or customer..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Select
                    value={(table.getColumn("isApproved")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                        table.getColumn("isApproved")?.setFilterValue(value)
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter status"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null :
                                            flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getRowModel().rows.length} of {data.length} reviews
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
