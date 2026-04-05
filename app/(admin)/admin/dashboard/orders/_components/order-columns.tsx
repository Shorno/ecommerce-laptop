"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/db/schema/order"
import { OrderItem } from "@/db/schema/order"
import { Payment } from "@/db/schema/payment"
import ViewOrderDialog from "./view-order-dialog"
import UpdateOrderStatusDialog from "./update-order-status-dialog"
import DeleteOrderDialog from "./delete-order-dialog"
import VerifyPaymentDialog from "./verify-payment-dialog"
import { useTranslations } from "next-intl"

export interface OrderWithDetails extends Order {
    items: OrderItem[]
    payment: Payment | null
    itemCount: number
    paymentMethod: string | null
    paymentStatus: string | null
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

const paymentStatusVariants = {
    pending: "secondary",
    processing: "secondary",
    completed: "default",
    failed: "destructive",
    refunded: "outline",
    partially_refunded: "outline",
    cancelled: "destructive",
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
            cell: ({ row }) => (
                <div className="font-medium text-center">{row.getValue("orderNumber")}</div>
            ),
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
            accessorKey: "paymentMethod",
            header: () => <div className="text-center">{t('payment')}</div>,
            cell: ({ row }) => {
                const order = row.original
                const paymentStatus = order.paymentStatus as keyof typeof paymentStatusVariants | null
                return (
                    <div className="text-center">
                        <div className="text-sm font-medium">
                            {order.paymentMethod || "N/A"}
                        </div>
                        {paymentStatus && (
                            <Badge
                                variant={paymentStatusVariants[paymentStatus] || "secondary"}
                                className="mt-1"
                            >
                                {t(`paymentStatus.${paymentStatus}`)}
                            </Badge>
                        )}
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
                                <ViewOrderDialog order={order} />
                                <UpdateOrderStatusDialog order={order} />
                                <DeleteOrderDialog
                                    orderId={order.id}
                                    orderNumber={order.orderNumber}
                                />
                                <DropdownMenuSeparator />
                                <VerifyPaymentDialog order={order} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    return columns;
}
