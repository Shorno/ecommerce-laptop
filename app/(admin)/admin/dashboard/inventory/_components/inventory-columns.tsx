"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, Check, Loader, Pencil, X, Package} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {useState} from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Input} from "@/components/ui/input"
import {Switch} from "@/components/ui/switch"
import {cn} from "@/lib/utils"
import type {InventoryItem} from "../actions/inventory-actions"
import {updateVariantStock} from "../actions/inventory-actions"

function parseOptionValues(json: string | null): Record<string, string> {
    if (!json) return {}
    try {
        return JSON.parse(json)
    } catch {
        return {}
    }
}

function getStockLevel(stock: number): "critical" | "low" | "ok" | "high" {
    if (stock === 0) return "critical"
    if (stock <= 5) return "low"
    if (stock <= 20) return "ok"
    return "high"
}

const stockColors: Record<string, string> = {
    critical: "text-red-600 bg-red-50 border-red-200",
    low: "text-orange-600 bg-orange-50 border-orange-200",
    ok: "text-blue-600 bg-blue-50 border-blue-200",
    high: "text-green-600 bg-green-50 border-green-200",
}

const stockLabels: Record<string, string> = {
    critical: "Out of Stock",
    low: "Low Stock",
    ok: "In Stock",
    high: "In Stock",
}

// Inline stock editor cell
function StockCell({item}: { item: InventoryItem }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editStock, setEditStock] = useState(item.stock)
    const [editInStock, setEditInStock] = useState(item.inStock)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: () => updateVariantStock(item.variantId, editStock, editInStock),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Stock updated")
                queryClient.invalidateQueries({queryKey: ["admin-inventory"]})
                queryClient.invalidateQueries({queryKey: ["admin-dashboard-stats"]})
                setIsEditing(false)
            } else {
                toast.error(result.error || "Failed to update")
            }
        },
        onError: () => toast.error("Failed to update stock"),
    })

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                    className="w-20 h-8 text-sm text-center"
                    min={0}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") mutation.mutate()
                        if (e.key === "Escape") {
                            setEditStock(item.stock)
                            setEditInStock(item.inStock)
                            setIsEditing(false)
                        }
                    }}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? <Loader className="h-3.5 w-3.5 animate-spin"/> :
                        <Check className="h-3.5 w-3.5"/>}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                        setEditStock(item.stock)
                        setEditInStock(item.inStock)
                        setIsEditing(false)
                    }}
                    disabled={mutation.isPending}
                >
                    <X className="h-3.5 w-3.5"/>
                </Button>
            </div>
        )
    }

    const level = getStockLevel(item.stock)

    return (
        <div className="flex items-center gap-2">
            <span className="font-semibold tabular-nums text-sm">{item.stock}</span>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground/50 hover:text-primary"
                onClick={() => setIsEditing(true)}
            >
                <Pencil className="h-3 w-3"/>
            </Button>
        </div>
    )
}

// Inline availability toggle
function AvailabilityCell({item}: { item: InventoryItem }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (newInStock: boolean) => updateVariantStock(item.variantId, item.stock, newInStock),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Availability updated")
                queryClient.invalidateQueries({queryKey: ["admin-inventory"]})
            } else {
                toast.error(result.error || "Failed to update")
            }
        },
        onError: () => toast.error("Failed to update availability"),
    })

    return (
        <div className="flex justify-center">
            <Switch
                checked={item.inStock}
                onCheckedChange={(checked) => mutation.mutate(checked)}
                disabled={mutation.isPending}
            />
        </div>
    )
}

export const inventoryColumns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: "productName",
        header: () => <div className="text-left">Product</div>,
        cell: ({row}) => {
            const item = row.original
            const options = parseOptionValues(item.optionValues)
            const variantLabel = Object.values(options).join(" / ")

            return (
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Link
                            href={`/admin/dashboard/products/edit/${item.productId}`}
                            className="font-medium text-sm hover:text-primary hover:underline transition-colors truncate"
                        >
                            {item.productName}
                        </Link>
                        {variantLabel ? (
                            <span className="text-xs text-muted-foreground truncate">{variantLabel}</span>
                        ) : (
                            <span className="text-xs text-muted-foreground">Default Variant</span>
                        )}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "sku",
        header: () => <div className="text-center">SKU</div>,
        cell: ({row}) => {
            const sku = row.getValue("sku") as string | null
            return (
                <div className="text-center">
                    {sku ? (
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{sku}</code>
                    ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "categoryName",
        header: () => <div className="text-center">Category</div>,
        cell: ({row}) => (
            <div className="text-center text-sm">{row.getValue("categoryName")}</div>
        ),
        filterFn: "equalsString",
    },
    {
        accessorKey: "brandName",
        header: () => <div className="text-center">Brand</div>,
        cell: ({row}) => {
            const brandName = row.getValue("brandName") as string | null
            return (
                <div className="text-center text-sm">
                    {brandName || <span className="text-muted-foreground">—</span>}
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({column}) => (
            <div className="flex justify-center">
                <Button variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        ),
        cell: ({row}) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
            }).format(price)
            return <div className="text-center font-medium tabular-nums text-sm">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: ({column}) => (
            <div className="flex justify-center">
                <Button variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Stock
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        ),
        cell: ({row}) => (
            <div className="flex justify-center">
                <StockCell item={row.original}/>
            </div>
        ),
    },
    {
        id: "status",
        header: () => <div className="text-center">Status</div>,
        accessorFn: (row) => {
            if (!row.inStock) return "disabled"
            return getStockLevel(row.stock)
        },
        cell: ({row}) => {
            const item = row.original
            if (!item.inStock) {
                return (
                    <div className="flex justify-center">
                        <Badge variant="outline" className="text-[11px] text-muted-foreground border-muted">
                            Disabled
                        </Badge>
                    </div>
                )
            }
            const level = getStockLevel(item.stock)
            return (
                <div className="flex justify-center">
                    <Badge
                        variant="outline"
                        className={cn("text-[11px] border", stockColors[level])}
                    >
                        {stockLabels[level]}
                    </Badge>
                </div>
            )
        },
        filterFn: "equalsString",
    },
    {
        accessorKey: "inStock",
        header: () => <div className="text-center">Available</div>,
        cell: ({row}) => <AvailabilityCell item={row.original}/>,
    },
]
