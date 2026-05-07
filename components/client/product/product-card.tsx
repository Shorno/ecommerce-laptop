"use client"

import {useState} from "react"
import Image from "next/image"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {formatPrice} from "@/utils/currency";
import {Star, ShoppingCart, Zap, Check} from "lucide-react"
import {useCartActions} from "@/stote/cart-sotre"
import {toast} from "sonner"

interface ProductCardProps {
    product: {
        id: number
        name: string
        slug: string
        image: string
        isFeatured: boolean
        minPrice: string | null
        category: {
            name: string
            slug: string
        }
        variants?: {
            id: number
            price: string
            stock: number
            inStock: boolean
        }[]
    }
    reviewStats?: {
        averageRating: number
        totalReviews: number
    }
    flashSale?: {
        discountType: string
        discountValue: string
        saleEndDate: Date
    } | null
}

export function ProductCard({product, reviewStats, flashSale}: ProductCardProps) {
    const variants = product.variants || []
    const hasVariants = variants.length > 0
    const allOutOfStock = hasVariants ? variants.every(v => !v.inStock || v.stock === 0) : true
    const {addItem} = useCartActions()
    const [justAdded, setJustAdded] = useState(false)

    // Find cheapest in-stock variant for quick add
    const cheapestVariant = variants
        .filter(v => v.inStock && v.stock > 0)
        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0] || null

    // Compute price display
    const prices = variants.map(v => parseFloat(v.price))
    const minPrice = prices.length > 0 ? Math.min(...prices) : null
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null

    const originalPrice = product.minPrice
        ? parseFloat(product.minPrice)
        : minPrice ?? 0

    // Flash sale price calculation
    let salePrice: number | null = null
    let discountPercent = 0
    if (flashSale && originalPrice > 0) {
        const discount = parseFloat(flashSale.discountValue)
        salePrice = flashSale.discountType === "percentage"
            ? Math.max(0, Math.round(originalPrice * (1 - discount / 100)))
            : Math.max(0, Math.round(originalPrice - discount))
        discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    }

    const displayPrice = salePrice !== null
        ? formatPrice(salePrice.toString())
        : product.minPrice
            ? formatPrice(product.minPrice)
            : minPrice
                ? formatPrice(minPrice.toString())
                : "Price TBD"

    const hasMultiplePrices = !flashSale && minPrice !== null && maxPrice !== null && minPrice !== maxPrice

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!cheapestVariant) return

        await addItem({
            id: product.id,
            variantId: cheapestVariant.id,
            variantLabel: "Default",
            name: product.name,
            image: product.image,
            price: salePrice !== null ? salePrice.toString() : cheapestVariant.price,
            maxStock: cheapestVariant.stock,
        })
        toast.success(`${product.name} added to cart`)
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 1500)
    }

    return (
        <Link href={`/product/${product.slug}`} className="group block h-full">
            <div className="h-full flex flex-col rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/8 transition-all duration-300 hover:-translate-y-0.5">
                {/* Image Container */}
                <div className={`relative w-full aspect-[4/3] bg-gray-50 overflow-hidden ${allOutOfStock ? "opacity-50 grayscale" : ""}`}>
                    {/* Status Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
                        {allOutOfStock && (
                            <Badge className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 border-0 shadow-sm">
                                Sold Out
                            </Badge>
                        )}
                        {flashSale && !allOutOfStock && (
                            <Badge className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 border-0 shadow-sm flex items-center gap-0.5">
                                <Zap className="h-2.5 w-2.5 fill-current"/>
                                -{discountPercent}%
                            </Badge>
                        )}
                        {product.isFeatured && !allOutOfStock && !flashSale && (
                            <Badge className="bg-tech-accent text-white text-[10px] font-semibold px-2 py-0.5 border-0 shadow-sm">
                                Featured
                            </Badge>
                        )}
                    </div>

                    {/* Variant count */}
                    {variants.length > 1 && (
                        <div className="absolute top-2.5 right-2.5 z-10">
                            <Badge variant="secondary"
                                   className="text-[10px] font-medium px-1.5 py-0.5 bg-white/90 backdrop-blur-sm shadow-sm border-0">
                                {variants.length} options
                            </Badge>
                        </div>
                    )}

                    {/* Add to cart button */}
                    {!allOutOfStock && cheapestVariant && (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-tech-accent text-white rounded-full p-2 shadow-lg hover:scale-110 active:scale-95 focus:outline-none"
                            title="Add to cart"
                        >
                            {justAdded ? <Check className="h-3.5 w-3.5"/> : <ShoppingCart className="h-3.5 w-3.5"/>}
                        </button>
                    )}

                    {/* Product Image */}
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-3.5 sm:p-4">
                    {/* Category */}
                    <p className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-1 ${flashSale ? "text-red-500" : "text-tech-accent"}`}>
                        {flashSale ? "Flash Deal" : product.category.name}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-[13px] sm:text-sm font-medium mb-2 line-clamp-2 text-gray-800 leading-snug group-hover:text-tech-accent transition-colors duration-200">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {reviewStats && reviewStats.totalReviews > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`h-3 w-3 ${
                                            reviewStats.averageRating >= s
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-transparent text-gray-200"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] text-gray-400">
                                ({reviewStats.totalReviews})
                            </span>
                        </div>
                    )}

                    {/* Spacer */}
                    <div className="mt-auto"/>

                    {/* Price */}
                    <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5">
                                <p className={`text-base sm:text-lg font-bold ${flashSale ? "text-red-600" : "text-gray-900"}`}>
                                    {hasMultiplePrices ? (
                                        <>
                                            <span className="text-gray-400 text-xs font-normal">From </span>
                                            {displayPrice}
                                        </>
                                    ) : displayPrice}
                                </p>
                                {flashSale && originalPrice > 0 && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                        {formatPrice(originalPrice.toString())}
                                    </span>
                                )}
                            </div>
                            {!allOutOfStock && !flashSale && (
                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    In Stock
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
