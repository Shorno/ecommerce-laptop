import { notFound } from "next/navigation"
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getOrderById } from "@/app/actions/order"
import { formatPrice } from "@/utils/currency"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Order Confirmation",
    description: "Your order has been confirmed. View your order details and status.",
};

interface OrderConfirmationPageProps {
    searchParams: Promise<{orderId?: string}>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
    const { orderId } = await searchParams


    console.log(orderId)

    if (!orderId) {
        notFound()
    }

    const id = parseInt(orderId)

    if (isNaN(id)) {
        notFound()
    }

    const order = await getOrderById(id);

    if (!order) {
        notFound()
    }

    return (
        <div className="min-h-screen py-8 bg-muted/30">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-4">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your order. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                {/* Order Number */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                                <p className="text-2xl font-bold">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">{order.customerFullName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            <Separator className="my-3" />
                            <p className="text-sm">{order.shippingAddressLine}</p>
                            <p className="text-sm">
                                {order.shippingArea && `${order.shippingArea}, `}
                                {order.shippingCity} - {order.shippingPostalCode}
                            </p>
                            <p className="text-sm">{order.shippingCountry}</p>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-medium">Cash on Delivery</p>
                                <p className="text-sm text-muted-foreground">
                                    Payment will be collected upon delivery
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{formatPrice(parseFloat(order.subtotal))}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping:</span>
                                    <span className="font-medium">
                                        {parseFloat(order.shippingAmount) === 0
                                            ? "FREE"
                                            : formatPrice(parseFloat(order.shippingAmount))}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span className="text-primary">{formatPrice(parseFloat(order.totalAmount))}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Items ({order.items.length} items)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden relative">
                                        {item.productImage ? (
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Package className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.productName}</h4>
                                        <p className="text-sm text-muted-foreground">Size: {item.productSize}</p>
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatPrice(parseFloat(item.unitPrice))}</p>
                                        <p className="text-sm text-muted-foreground">each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href={`/orders/${order.id}`}>
                            View Order Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
