"use client"
import Image from "next/image"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartItems, useCartTotalPrice } from "@/stote/cart-sotre"
import { formatPrice } from "@/utils/currency"

interface CartReviewProps {
    isProcessing?: boolean
}

export default function CartReview({ isProcessing = false }: CartReviewProps) {
    const cartItems = useCartItems()
    const subtotal = useCartTotalPrice()

    return (
        <Card className="rounded-sm flex flex-col">
            <CardHeader>
                <CardTitle>Review your cart</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto">
                {/* Cart Items - Read Only */}
                <div className="space-y-4">
                    {cartItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-4"
                        >
                            <div className="flex-shrink-0 relative">
                                <div className="relative overflow-hidden rounded-lg border">
                                    <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold line-clamp-2">
                                    {item.name} <span className="text-muted-foreground font-normal">({item.size})</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Quantity: {item.quantity}×
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
            </CardContent>

            <CardFooter className="flex-col space-y-3 border-t">
                {/* Order Summary - Always at bottom */}
                <div className="w-full space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-base font-bold pt-3 border-t">
                        <span>Total</span>
                        <span>{formatPrice(subtotal)}</span>
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
            </CardFooter>
        </Card>

    )
}
