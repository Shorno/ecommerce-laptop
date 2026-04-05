"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Zap, Plus, Minus } from "lucide-react"
import { ProductWithRelations } from "@/db/schema"
import { toast } from "sonner"
import { useCartActions, useCartItems } from "@/stote/cart-sotre"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ProductDetailsActionsProps {
    product: ProductWithRelations
}

export function ProductDetailsActions({ product }: ProductDetailsActionsProps) {
    const session = authClient.useSession()
    const router = useRouter()
    const items = useCartItems()
    const { addItem, buyNow } = useCartActions()
    const isAuthenticated = !!session.data?.user
    const [quantity, setQuantity] = useState(1)

    const maxQuantity = product.stockQuantity ?? 1

    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            setQuantity(prev => prev + 1)
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const handleAddToCart = () => {
        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock")
            return
        }

        const cartItem = items.find(item => item.id === product.id)
        if (cartItem && cartItem.quantity >= (product.stockQuantity ?? Infinity)) {
            toast.warning("Maximum quantity in cart")
            return
        }

        addItem(product, isAuthenticated)
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`
        })
    }

    const handleBuyNow = async () => {
        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock")
            return
        }

        if (quantity > maxQuantity) {
            toast.error("Quantity exceeds available stock")
            return
        }

        // Clear cart and add only this product with selected quantity
        await buyNow(product, quantity, isAuthenticated)

        // Redirect to checkout
        router.push("/checkout")
        toast.success("Proceeding to checkout", {
            description: `${quantity} x ${product.name}`
        })
    }

    return (
        <div className="space-y-3">
            {/* Quantity Selector */}
            <Card>
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleDecrement}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <div className="w-12 text-center font-medium">
                                {quantity}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleIncrement}
                                disabled={quantity >= maxQuantity}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <p className="text-xs text-amber-600 mt-2">
                            ⚠️ Only {product.stockQuantity} left in stock!
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    variant="outline"
                    size="default"
                    className="flex-1 min-w-[140px]"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>

                <Button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    size="default"
                    className="flex-1 min-w-[140px]"
                >
                    <Zap className="mr-2 h-4 w-4" />
                    Buy Now
                </Button>
            </div>
        </div>
    )
}
