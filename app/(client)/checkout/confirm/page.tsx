import { notFound } from "next/navigation"
import { Package, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className="min-h-screen flex items-start justify-center py-10 md:py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* Left Column — Thank You + Address */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                                Thank you for your<br />purchase!
                            </h1>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Your order will be processed within 24 hours during working days. We will
                                notify you by email once your order has been shipped.
                            </p>
                        </div>

                        {/* Billing Address */}
                        <div>
                            <h2 className="text-base font-semibold mb-4">Billing address</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-6">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Name</span>
                                    <span className="text-muted-foreground">{order.customerFullName}</span>
                                </div>
                                <div className="flex gap-6">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Address</span>
                                    <span className="text-muted-foreground">
                                        {order.shippingAddressLine},&nbsp;
                                        {order.shippingArea && `${order.shippingArea}, `}
                                        {order.shippingCity} - {order.shippingPostalCode}
                                    </span>
                                </div>
                                <div className="flex gap-6">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Phone</span>
                                    <span className="text-muted-foreground">{order.customerPhone}</span>
                                </div>
                                <div className="flex gap-6">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Email</span>
                                    <span className="text-muted-foreground">{order.customerEmail}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button asChild size="lg" className="gap-2 bg-tech-accent hover:bg-tech-accent/90 text-white rounded-full px-8">
                                <Link href={`/orders/${order.id}`}>
                                    Track Your Order
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="rounded-full px-8">
                                <Link href="/">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column — Order Summary Receipt */}
                    <Card className="rounded-xl shadow-lg border">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-5">Order Summary</h2>

                            {/* Order Meta Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg mb-5 text-sm">
                                <div className="flex sm:block justify-between items-center">
                                    <p className="text-muted-foreground text-xs">Date</p>
                                    <p className="font-semibold text-sm">{orderDate}</p>
                                </div>
                                <div className="flex sm:block justify-between items-center">
                                    <p className="text-muted-foreground text-xs">Order Number</p>
                                    <p className="font-semibold text-xs font-mono">{order.orderNumber}</p>
                                </div>
                                <div className="flex sm:block justify-between items-center">
                                    <p className="text-muted-foreground text-xs">Payment</p>
                                    <p className="font-semibold text-sm">Cash on Delivery</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4 mb-5">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="h-14 w-14 rounded-lg bg-muted/50 border flex items-center justify-center overflow-hidden relative flex-shrink-0">
                                            {item.productImage ? (
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            ) : (
                                                <Package className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium line-clamp-2">{item.productName}</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {item.productSize && <span>{item.productSize}</span>}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold">{formatPrice(parseFloat(item.unitPrice) * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="mb-4" />

                            {/* Price Breakdown */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sub Total</span>
                                    <span className="font-medium">{formatPrice(parseFloat(order.subtotal))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                        {parseFloat(order.shippingAmount) === 0
                                            ? "Free"
                                            : formatPrice(parseFloat(order.shippingAmount))}
                                    </span>
                                </div>
                            </div>

                            <Separator className="mb-4" />

                            {/* Order Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold">Order Total</span>
                                <span className="text-xl font-bold text-tech-accent">{formatPrice(parseFloat(order.totalAmount))}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
