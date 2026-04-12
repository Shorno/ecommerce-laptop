"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/db/schema/order"
import { OrderItem } from "@/db/schema/order"
import UpdateOrderStatusDialog from "./update-order-status-dialog"
import DeleteOrderDialog from "./delete-order-dialog"
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
            id: "actions",
            header: () => <div className="text-center">{t('actions')}</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original

                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t('openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/dashboard/orders/${order.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                <UpdateOrderStatusDialog order={order} />
                                <DeleteOrderDialog
                                    orderId={order.id}
                                    orderNumber={order.orderNumber}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    return columns;
}
