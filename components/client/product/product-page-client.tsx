"use client"

import {useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {ShoppingCart, ShoppingBag, Plus, Minus, Zap} from "lucide-react"
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
    flashSale?: {
        discountType: string
        discountValue: string
        saleEndDate: Date
        saleTitle: string
    } | null
}

export function ProductPageClient({productId, productName, productImage, options, variants, isFeatured, flashSale}: ProductPageClientProps) {
    const session = authClient.useSession()
    const router = useRouter()
    const items = useCartItems()
    const {addItem, buyNow} = useCartActions()
    const isAuthenticated = !!session.data?.user
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)

    const hasOptions = options.length > 0
    const originalPrice = selectedVariant?.price || (variants[0]?.price) || "0"
    const displayStock = selectedVariant?.stock ?? (variants[0]?.stock) ?? 0
    const isInStock = selectedVariant?.inStock ?? (variants[0]?.inStock) ?? false
    const maxQuantity = displayStock

    // Flash sale price calculation
    let salePrice: string | null = null
    let discountPercent = 0
    if (flashSale) {
        const original = parseFloat(originalPrice)
        const discount = parseFloat(flashSale.discountValue)
        const calculated = flashSale.discountType === "percentage"
            ? Math.max(0, Math.round(original * (1 - discount / 100)))
            : Math.max(0, Math.round(original - discount))
        salePrice = calculated.toString()
        discountPercent = original > 0 ? Math.round(((original - calculated) / original) * 100) : 0
    }

    const displayPrice = salePrice || originalPrice

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
        <div className="space-y-5">
            {/* Flash Sale Banner */}
            {flashSale && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                    <Zap className="h-4 w-4 text-red-500 fill-red-500 flex-shrink-0"/>
                    <span className="text-sm font-semibold text-red-600">{flashSale.saleTitle}</span>
                    <Badge className="ml-auto bg-red-500 text-white border-0 text-[10px]">-{discountPercent}%</Badge>
                </div>
            )}

            {/* Price + Stock */}
            <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-2">
                    <p className={`text-2xl md:text-3xl font-bold tracking-tight ${flashSale ? "text-red-600" : "text-foreground"}`}>
                        {formatPrice(displayPrice)}
                    </p>
                    {flashSale && (
                        <p className="text-base text-muted-foreground line-through">
                            {formatPrice(originalPrice)}
                        </p>
                    )}
                </div>
                {isInStock ? (
                    <Badge variant="outline" className="text-[11px] font-medium text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800">
                        In Stock ({displayStock})
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="text-[11px] font-medium bg-muted text-muted-foreground">
                        Out of Stock
                    </Badge>
                )}
            </div>

            {/* Variant Selector */}
            {hasOptions && (
                <VariantSelector
                    options={options}
                    variants={variants}
                    onVariantChange={handleVariantChange}
                />
            )}

            {/* Quantity + Actions */}
            <div className="space-y-3">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Qty</span>
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
                        >
                            <Minus className="h-3.5 w-3.5"/>
                        </button>
                        <div className="h-9 w-12 flex items-center justify-center text-sm font-medium border-x border-border">
                            {quantity}
                        </div>
                        <button
                            onClick={handleIncrement}
                            disabled={quantity >= maxQuantity}
                            className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
                        >
                            <Plus className="h-3.5 w-3.5"/>
                        </button>
                    </div>
                    {displayStock <= 5 && displayStock > 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                            Only {displayStock} left
                        </span>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5">
                    <Button
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        variant="outline"
                        size="lg"
                        className="flex-1 h-11 text-sm font-medium gap-2"
                    >
                        <ShoppingCart className="h-4 w-4"/>
                        Add to Cart
                    </Button>
                    <Button
                        onClick={handleBuyNow}
                        disabled={!isInStock}
                        size="lg"
                        className="flex-1 h-11 text-sm font-medium gap-2 bg-tech-accent hover:bg-tech-accent/90 text-white"
                    >
                        <ShoppingBag className="h-4 w-4"/>
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
