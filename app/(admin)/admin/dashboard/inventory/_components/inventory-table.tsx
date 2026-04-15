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
import {Package, AlertTriangle, AlertCircle} from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    stats: {
        total: number
        outOfStock: number
        lowStock: number
        inStock: number
    }
}

export default function InventoryTable<TData, TValue>({
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
            pagination: {pageSize: 20},
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card">
                    <Package className="h-4 w-4 text-muted-foreground shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight">{stats.total}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">Total Variants</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight text-red-600">{stats.outOfStock}</p>
                        <p className="text-[11px] font-medium text-red-600/70">Out of Stock</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight text-orange-600">{stats.lowStock}</p>
                        <p className="text-[11px] font-medium text-orange-600/70">Low Stock (≤5)</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50">
                    <Package className="h-4 w-4 text-green-600 shrink-0"/>
                    <div>
                        <p className="text-lg font-bold leading-tight text-green-600">{stats.inStock}</p>
                        <p className="text-[11px] font-medium text-green-600/70">In Stock</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Input
                    placeholder="Search products, SKU..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Select
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Stock Status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="critical">Out of Stock</SelectItem>
                            <SelectItem value="low">Low Stock</SelectItem>
                            <SelectItem value="ok">In Stock</SelectItem>
                            <SelectItem value="high">High Stock</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                    No inventory items found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getRowModel().rows.length} of {data.length} variants
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
