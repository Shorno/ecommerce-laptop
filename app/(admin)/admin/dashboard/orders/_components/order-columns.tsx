"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/db/schema/order"
import { OrderItem } from "@/db/schema/order"
import { useTranslations } from "next-intl"

export interface OrderWithDetails extends Order {
    items: OrderItem[]
    itemCount: number
}

const statusVariants = {
    pending: "secondary",
    confirmed: "default",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline",
} as const

export function useOrderColumns() {
    const t = useTranslations('orders');

    const columns: ColumnDef<OrderWithDetails>[] = [
        {
            accessorKey: "orderNumber",
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('orderNumber')}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const order = row.original
                return (
                    <div className="text-center">
                        <Link
                            href={`/admin/dashboard/orders/${order.id}`}
                            className="font-medium text-primary hover:underline"
                        >
                            {order.orderNumber}
                        </Link>
                    </div>
                )
            },
        },
        {
            accessorKey: "customerFullName",
            header: () => <div className="text-center">{t('customer')}</div>,
            cell: ({ row }) => {
                const order = row.original
                return (
                    <div className="text-center">
                        <div className="font-medium">{order.customerFullName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </div>
                )
            },
        },
        {
            accessorKey: "itemCount",
            header: () => <div className="text-center">{t('items')}</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.getValue("itemCount")}</div>
            ),
        },
        {
            accessorKey: "totalAmount",
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('total')}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalAmount"))
                const formatted = new Intl.NumberFormat("en-BD", {
                    style: "currency",
                    currency: "BDT",
                }).format(amount)
                return <div className="text-center font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">{t('orderStatus')}</div>,
            cell: ({ row }) => {
                const status = row.getValue("status") as keyof typeof statusVariants
                return (
                    <div className="flex justify-center">
                        <Badge variant={statusVariants[status] || "secondary"}>
                            {t(`status.${status}`)}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('created')}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"))
                return (
                    <div className="text-center text-sm">
                        {date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                )
            },
        },
        {
            id: "details",
            header: () => <div className="text-center">{t('actions')}</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original
                return (
                    <div className="flex justify-center">
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-primary">
                            <Link href={`/admin/dashboard/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                            </Link>
                        </Button>
                    </div>
                )
            },
        },
    ]

    return columns;
}
