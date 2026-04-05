"use client"

import {useSearchParams, useRouter} from "next/navigation"
import {useQuery} from "@tanstack/react-query"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {CheckCircle, Loader2, Package, AlertCircle, Clock} from "lucide-react"
import Link from "next/link"
import {getOrderStatus, OrderStatusResponse} from "@/app/(client)/actions/get-order-status"
import {formatPrice} from "@/utils/currency"

export default function PaymentSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    const {data, isLoading, error} = useQuery<OrderStatusResponse>({
        queryKey: ["order-status", orderId],
        queryFn: () => getOrderStatus(Number(orderId)),
        enabled: !!orderId,
        refetchInterval: (data) => {
            const responseData = data.state.data
            if (responseData?.success && responseData.order.status === "confirmed" && responseData.payment?.status === "completed") {
                return false
            }
            return 2000
        },
        refetchIntervalInBackground: false,
        retry: 3,
    })



    if (!orderId) {
        return (
            <div className="flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5"/>
                            Missing Order Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            No order ID was provided. Please check your orders page.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => router.push("/account/orders")} className="w-full">
                                View My Orders
                            </Button>
                            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary"/>
                            <p className="text-sm text-muted-foreground">
                                Processing your payment...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Please wait while we confirm your transaction
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || (data && !data.success)) {
        const message = data && !data.success ? data.error : "Failed to load order information"
        return (
            <div className="flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5"/>
                            Payment Verification Issue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <p className="text-sm text-destructive">
                                {message || "Failed to load order information"}
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 font-medium mb-2">
                                Payment May Still Be Processing
                            </p>
                            <p className="text-xs text-yellow-700">
                                If you completed the payment, it may take a few moments to reflect.
                                Please check your orders page.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button onClick={() => router.push("/account/orders")} className="w-full">
                                View My Orders
                            </Button>
                            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const {order: orderData, payment: paymentData} = data

    if (orderData.status !== "confirmed" || paymentData?.status !== "completed") {
        return (
            <div className="flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center py-8 space-y-4">
                            <Clock className="h-12 w-12 mx-auto text-amber-500"/>
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    Order #{orderData.orderNumber}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Payment Status: <span
                                    className="capitalize">{paymentData?.status || "pending"}</span>
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Waiting for payment confirmation...
                            </p>
                            <div className="mt-4">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Success Card */}
                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div
                                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600"/>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-green-900 mb-2">
                                    Payment Successful!
                                </h1>
                                <p className="text-green-700">
                                    Your order has been confirmed and payment received
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Order Number</p>
                                <p className="font-medium">{orderData.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Amount</p>
                                <p className="font-medium text-lg">
                                    {formatPrice(parseFloat(orderData.totalAmount))}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Payment Method</p>
                                <p className="font-medium capitalize">
                                    {paymentData?.paymentMethod === "cod"
                                        ? "Cash on Delivery"
                                        : paymentData?.paymentMethod || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium text-green-600 capitalize">
                                    {paymentData?.status || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="pt-4 border-t space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(parseFloat(orderData.subtotal))}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatPrice(parseFloat(orderData.shippingAmount))}</span>
                            </div>
                            <div className="flex justify-between font-medium text-base pt-2 border-t">
                                <span>Total</span>
                                <span>{formatPrice(parseFloat(orderData.totalAmount))}</span>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="pt-4 border-t space-y-3">
                            <div>
                                <p className="text-sm font-medium mb-2">Shipping Address</p>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground">{orderData.customerFullName}</p>
                                    <p>{orderData.shippingAddressLine}</p>
                                    <p>
                                        {orderData.shippingArea && `${orderData.shippingArea}, `}
                                        {orderData.shippingCity} {orderData.shippingPostalCode}
                                    </p>
                                    <p>{orderData.shippingCountry}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t">
                                <p className="text-sm text-muted-foreground">
                                    A confirmation email has been sent to{" "}
                                    <strong className="text-foreground">{orderData.customerEmail}</strong>
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Contact: <strong className="text-foreground">{orderData.customerPhone}</strong>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1" size="lg">
                        <Link href={`/account/orders/${orderData.id}`}>
                            <Package className="h-4 w-4 mr-2"/>
                            View Order Details
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1" size="lg">
                        <Link href="/">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}