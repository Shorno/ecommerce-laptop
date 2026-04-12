"use client"

import {useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {ShoppingCart, ShoppingBag, Plus, Minus} from "lucide-react"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import {formatPrice} from "@/utils/currency"
import VariantSelector, {SelectedVariant} from "@/components/client/product/variant-selector"
import {useCartActions, useCartItems} from "@/stote/cart-sotre"
import {authClient} from "@/lib/auth-client"

interface ProductPageClientProps {
    productId: number
    productName: string
    productImage: string
    options: { name: string; values: string[] }[]
    variants: { id: number; price: string; stock: number; inStock: boolean; optionValues: Record<string, string> | null }[]
    isFeatured: boolean
}

export function ProductPageClient({productId, productName, productImage, options, variants, isFeatured}: ProductPageClientProps) {
    const session = authClient.useSession()
    const router = useRouter()
    const items = useCartItems()
    const {addItem, buyNow} = useCartActions()
    const isAuthenticated = !!session.data?.user
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)

    const hasOptions = options.length > 0
    const displayPrice = selectedVariant?.price || (variants[0]?.price) || "0"
    const displayStock = selectedVariant?.stock ?? (variants[0]?.stock) ?? 0
    const isInStock = selectedVariant?.inStock ?? (variants[0]?.inStock) ?? false
    const maxQuantity = displayStock

    const handleIncrement = () => {
        if (quantity < maxQuantity) setQuantity(prev => prev + 1)
    }

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1)
    }

    const handleVariantChange = (variant: SelectedVariant | null) => {
        setSelectedVariant(variant)
        setQuantity(1) // Reset quantity on variant change
    }

    const handleAddToCart = () => {
        if (!isInStock || displayStock === 0) {
            toast.error("Out of stock")
            return
        }

        const variantId = selectedVariant?.id || variants[0]?.id
        if (!variantId) {
            toast.error("Please select a variant")
            return
        }

        // Build a cart-compatible item
        const cartProduct = {
            id: productId,
            variantId,
            variantLabel: selectedVariant?.label || "Default",
            name: productName,
            image: productImage,
            price: displayPrice,
            maxStock: displayStock,
        }

        addItem(cartProduct as any, isAuthenticated)
        toast.success("Added to cart", {
            description: `${productName} - ${selectedVariant?.label || "Default"}`
        })
    }

    const handleBuyNow = async () => {
        if (!isInStock || displayStock === 0) {
            toast.error("Out of stock")
            return
        }

        if (quantity > maxQuantity) {
            toast.error("Quantity exceeds available stock")
            return
        }

        const variantId = selectedVariant?.id || variants[0]?.id
        if (!variantId) {
            toast.error("Please select a variant")
            return
        }

        const cartProduct = {
            id: productId,
            variantId,
            variantLabel: selectedVariant?.label || "Default",
            name: productName,
            image: productImage,
            price: displayPrice,
            maxStock: displayStock,
        }

        await buyNow(cartProduct as any, quantity, isAuthenticated)
        router.push("/checkout")
        toast.success("Proceeding to checkout", {
            description: `${quantity} x ${productName}`
        })
    }

    return (
        <div className="space-y-4">
            {/* Price Display */}
            <div className="bg-muted/50 rounded-lg px-4 py-3 flex items-center justify-between">
                <p className="text-2xl md:text-3xl font-bold text-tech-accent">
                    {formatPrice(displayPrice)}
                </p>
                {isInStock ? (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        In Stock ({displayStock})
                    </Badge>
                ) : (
                    <Badge variant="destructive" className="text-xs">
                        Out of Stock
                    </Badge>
                )}
            </div>

            {/* Variant Selector */}
            {hasOptions && (
                <div className="bg-card border border-border rounded-lg p-4">
                    <VariantSelector
                        options={options}
                        variants={variants}
                        onVariantChange={handleVariantChange}
                    />
                </div>
            )}

            {/* Quantity Selector */}
            <Card>
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline" size="icon" className="h-8 w-8"
                                onClick={handleDecrement} disabled={quantity <= 1}>
                                <Minus className="h-3.5 w-3.5"/>
                            </Button>
                            <div className="w-12 text-center font-medium">{quantity}</div>
                            <Button
                                variant="outline" size="icon" className="h-8 w-8"
                                onClick={handleIncrement} disabled={quantity >= maxQuantity}>
                                <Plus className="h-3.5 w-3.5"/>
                            </Button>
                        </div>
                    </div>
                    {displayStock <= 5 && displayStock > 0 && (
                        <p className="text-xs text-amber-600 mt-2">
                            ⚠️ Only {displayStock} left in stock!
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
                <Button onClick={handleAddToCart} disabled={!isInStock} variant="outline" size="default"
                        className="flex-1 min-w-[140px]">
                    <ShoppingCart className="mr-2 h-4 w-4"/>
                    Add to Cart
                </Button>
                <Button onClick={handleBuyNow} disabled={!isInStock} size="default"
                        className="flex-1 min-w-[140px]">
                    <ShoppingBag className="mr-2 h-4 w-4"/>
                    Buy Now
                </Button>
            </div>
        </div>
    )
}
