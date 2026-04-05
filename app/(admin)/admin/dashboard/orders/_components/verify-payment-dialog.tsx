"use client"

import * as React from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { verifyManualPayment } from "@/app/(admin)/admin/dashboard/orders/actions/verify-manual-payment"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { OrderWithDetails } from "./order-columns"

interface VerifyPaymentDialogProps {
    order: OrderWithDetails
}

export default function VerifyPaymentDialog({ order }: VerifyPaymentDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isPending, startTransition] = React.useTransition()
    const queryClient = useQueryClient()

    // Only show if payment is pending and has transaction details
    if (!order.payment || order.payment.status !== "pending" || !order.payment.transactionId) {
        return null
    }

    const handleVerify = async (approve: boolean) => {
        startTransition(async () => {
            try {
                const result = await verifyManualPayment({
                    paymentId: order.payment!.id,
                    approve,
                })

                if (result.success) {
                    toast.success(result.message)
                    setOpen(false)
                    // Refresh the orders list
                    queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
                    queryClient.invalidateQueries({ queryKey: ["pending-payments"] })
                } else {
                    toast.error(result.error)
                }
            } catch {
                toast.error("An error occurred. Please try again.")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verify Payment
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manual Payment Verification</DialogTitle>
                    <DialogDescription>
                        Review and verify the payment details submitted by the customer
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order Information */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">Order Information</h3>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="font-mono font-semibold">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="font-semibold">৳{order.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{order.customerFullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">Payment Details</h3>
                        <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Payment Method</span>
                                <Badge variant="outline">{order.payment.paymentMethod}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Transaction ID</span>
                                <code className="text-sm bg-background px-2 py-1 rounded">
                                    {order.payment.transactionId || "N/A"}
                                </code>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Sender Number</span>
                                <code className="text-sm bg-background px-2 py-1 rounded">
                                    {order.payment.senderNumber || "N/A"}
                                </code>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Amount</span>
                                <span className="text-lg font-bold">৳{order.payment.amount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status</span>
                                <Badge>{order.payment.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Submitted At</span>
                                <span className="text-sm">
                                    {new Date(order.payment.updatedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => handleVerify(true)}
                            disabled={isPending}
                            className="flex-1"
                            variant="default"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {isPending ? "Approving..." : "Approve Payment"}
                        </Button>
                        <Button
                            onClick={() => handleVerify(false)}
                            disabled={isPending}
                            className="flex-1"
                            variant="destructive"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            {isPending ? "Rejecting..." : "Reject Payment"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
