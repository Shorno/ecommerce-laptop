"use client"
import Image from "next/image"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartItems, useCartTotalPrice } from "@/stote/cart-sotre"
import { formatPrice } from "@/utils/currency"
import { ShoppingBag, Truck, ShieldCheck, Clock } from "lucide-react"

interface CartReviewProps {
    isProcessing?: boolean
}

export default function CartReview({ isProcessing = false }: CartReviewProps) {
    const cartItems = useCartItems()
    const subtotal = useCartTotalPrice()
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Card className="rounded-sm flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-tech-accent" />
                        Order Summary
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto">
                {/* Cart Items */}
                <div className="space-y-3">
                    {cartItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                        >
                            <div className="flex-shrink-0 relative">
                                <div className="relative overflow-hidden rounded-md border bg-white">
                                    <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 object-contain p-1"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium line-clamp-2 leading-snug">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                            </div>

                            <div className="flex-shrink-0 text-right">
                                <p className="text-sm font-bold">
                                    {formatPrice(item.subtotal)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Delivery Estimate */}
                <div className="flex items-center gap-2 mt-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <p className="text-xs font-medium">Estimated delivery: 3-5 business days</p>
                </div>
            </CardContent>

            <CardFooter className="flex-col space-y-3 border-t">
                {/* Order Summary */}
                <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" />
                            Shipping
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                    </div>

                    <div className="flex items-center justify-between text-base font-bold pt-3 border-t">
                        <span>Total</span>
                        <span className="text-tech-accent">{formatPrice(subtotal)}</span>
                    </div>
                </div>

                <Button
                    type="submit"
                    form="shipping-form"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing || cartItems.length === 0}
                >
                    Confirm Order
                </Button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Secure checkout
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Truck className="h-3.5 w-3.5" />
                        Free shipping
                    </div>
                </div>
            </CardFooter>
        </Card>

    )
}
