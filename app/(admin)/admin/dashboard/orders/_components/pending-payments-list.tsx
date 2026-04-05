"use client"

import {useQuery, useQueryClient} from "@tanstack/react-query"
import { getPendingPayments } from "@/app/(admin)/admin/dashboard/orders/actions/verify-manual-payment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton"
import { useTransition } from "react"
import { verifyManualPayment } from "@/app/(admin)/admin/dashboard/orders/actions/verify-manual-payment"
import { toast } from "sonner"
import {PaymentWithOrder} from "@/db/schema";

export default function PendingPaymentsList() {
    const [isPending, startTransition] = useTransition()
    const queryClient = useQueryClient()

    const { data: payments = [], isLoading, refetch } = useQuery<PaymentWithOrder[]>({
        queryKey: ["pending-payments"],
        queryFn: getPendingPayments,
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        staleTime : 30000,
    })

    console.log(payments)

    const handleVerify = async (paymentId: number, approve: boolean) => {
        startTransition(async () => {
            try {
                const result = await verifyManualPayment({
                    paymentId,
                    approve,
                })

                if (result.success) {
                    toast.success(result.message)
                    queryClient.invalidateQueries({queryKey : ["admin-orders"]})

                    refetch()
                } else {
                    toast.error(result.error)
                }
            } catch {
                toast.error("An error occurred. Please try again.")
            }
        })
    }

    if (isLoading) {
        return <TableSkeleton />
    }

    if (payments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pending Payment Verifications</CardTitle>
                    <CardDescription>No pending payments to verify</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">All payments are up to date!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Payment Verifications</CardTitle>
                    <CardDescription>
                        Review and verify manual payment submissions ({payments.length} pending)
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-4">
                {payments.map((payment) => (
                    <Card key={payment.id} className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Order #{payment.order.orderNumber}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {payment.order.customerFullName} • {payment.order.customerEmail}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Pending
                                    </Badge>
                                </div>

                                {/* Payment Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Payment Method</p>
                                        <p className="font-medium">{payment.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Transaction ID</p>
                                        <p className="font-mono text-sm">
                                            {payment.transactionId || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Sender Number</p>
                                        <p className="font-mono text-sm">
                                            {payment.senderNumber || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount</p>
                                        <p className="font-semibold text-lg">৳{payment.amount}</p>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="text-sm">
                                    <p className="text-muted-foreground">
                                        Phone: <span className="text-foreground font-medium">{payment.order.customerPhone}</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                        Submitted: <span className="text-foreground font-medium">
                                            {new Date(payment.createdAt).toLocaleString()}
                                        </span>
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={() => handleVerify(payment.id, true)}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="default"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        {isPending ? "Processing..." : "Approve"}
                                    </Button>
                                    <Button
                                        onClick={() => handleVerify(payment.id, false)}
                                        disabled={isPending}
                                        className="flex-1"
                                        variant="destructive"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
