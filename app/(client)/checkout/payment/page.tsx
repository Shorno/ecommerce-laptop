import {notFound} from "next/navigation"
import {Package, MapPin} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {getOrderById} from "@/app/actions/order"
import {formatPrice} from "@/utils/currency"
import Image from "next/image"
import type { Metadata } from "next"
import PaymentMethodAndButton from "@/app/(client)/checkout/payment/_components/payment-method-and-button";

export const metadata: Metadata = {
    title: "Payment",
    description: "Complete your payment to finalize your order.",
}

interface PaymentPageProps {
    searchParams: Promise<{ orderId?: string }>
}

export default async function PaymentPage({searchParams}: PaymentPageProps) {
    const {orderId} = await searchParams

    if (!orderId) {
        notFound()
    }

    const id = parseInt(orderId)

    if (isNaN(id)) {
        notFound()
    }

    const order = await getOrderById(id)

    if (!order) {
        notFound()
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 max-w-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-1">Complete Your Payment</h1>
                    <p className="text-sm text-muted-foreground">
                        Review your order and proceed with secure payment
                    </p>
                </div>

                <Card className="mb-4">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                            <Badge variant="outline" className="font-mono">
                                {order.orderNumber}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Package className="h-4 w-4"/>
                                Items ({order.items.length})
                            </p>
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                                        <div
                                            className="h-12 w-12 rounded bg-background flex items-center justify-center overflow-hidden relative flex-shrink-0">
                                            {item.productImage ? (
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Package className="h-5 w-5 text-muted-foreground"/>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.productName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.productSize} • Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-semibold text-sm">{formatPrice(parseFloat(item.unitPrice))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator/>

                        {/* Shipping Address - Compact */}
                        <div>
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4"/>
                                Shipping Address
                            </p>
                            <div className="p-3 bg-muted/50 rounded-md">
                                <p className="font-medium text-sm">{order.customerFullName}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {order.shippingAddressLine}, {order.shippingArea && `${order.shippingArea}, `}
                                    {order.shippingCity} - {order.shippingPostalCode}
                                </p>
                                <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                            </div>
                        </div>

                        <Separator/>

                        {/* Payment Summary */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-medium">{formatPrice(parseFloat(order.subtotal))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping:</span>
                                <span className="font-medium">
                                    {parseFloat(order.shippingAmount) === 0
                                        ? "FREE"
                                        : formatPrice(parseFloat(order.shippingAmount))}
                                </span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount:</span>
                                <span className="text-primary">{formatPrice(parseFloat(order.totalAmount))}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <PaymentMethodAndButton orderId={id}/>
            </div>
        </div>
    )
}
