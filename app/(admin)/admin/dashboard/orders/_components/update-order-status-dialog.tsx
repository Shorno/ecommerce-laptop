"use client"

import * as React from "react"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { OrderWithDetails } from "./order-columns"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { updateOrderStatus } from "../actions/update-order-status"
import { Loader } from "lucide-react"
import {OrderStatus} from "@/db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UpdateOrderStatusDialogProps {
    order: OrderWithDetails
}

const orderStatuses = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
]

export default function UpdateOrderStatusDialog({ order }: UpdateOrderStatusDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus>(order.status)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) =>
            updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
            toast.success("Order status updated successfully")
            setOpen(false)
        },
        onError: () => {
            toast.error("Failed to update order status")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedStatus === order.status) {
            toast.info("No changes made")
            setOpen(false)
            return
        }

        mutation.mutate({ orderId: order.id, status: selectedStatus })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Status
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                            Update the status for order #{order.orderNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Label htmlFor="status">Order Status</Label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                            disabled={mutation.isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {orderStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Update Status
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
