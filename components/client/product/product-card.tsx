"use client"

import Image from "next/image"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {formatPrice} from "@/utils/currency";
import {Star} from "lucide-react"

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
}

export function ProductCard({product, reviewStats}: ProductCardProps) {
    const variants = product.variants || []
    const hasVariants = variants.length > 0
    const allOutOfStock = hasVariants ? variants.every(v => !v.inStock || v.stock === 0) : true

    // Compute price display
    const prices = variants.map(v => parseFloat(v.price))
    const minPrice = prices.length > 0 ? Math.min(...prices) : null
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null
    const displayPrice = product.minPrice
        ? formatPrice(product.minPrice)
        : minPrice
            ? formatPrice(minPrice.toString())
            : "Price TBD"
    const hasMultiplePrices = minPrice !== null && maxPrice !== null && minPrice !== maxPrice

    return (
        <Link href={`/product/${product.slug}`} className="group block">
            <div className="h-full flex flex-col rounded-xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-border">
                {/* Image Container */}
                <div className={`relative w-full aspect-square bg-gradient-to-b from-muted/30 to-muted/10 overflow-hidden ${allOutOfStock ? "opacity-60" : ""}`}>
                    {/* Status Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
                        {allOutOfStock && (
                            <Badge variant="secondary" className="bg-foreground/80 text-background text-[10px] font-medium px-2 py-0.5 backdrop-blur-sm">
                                Sold Out
                            </Badge>
                        )}
                    </div>

                    {/* Variant count */}
                    {variants.length > 1 && (
                        <div className="absolute top-2.5 right-2.5 z-10">
                            <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0.5 bg-background/80 backdrop-blur-sm">
                                {variants.length} options
                            </Badge>
                        </div>
                    )}

                    {/* Product Image */}
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-3.5 sm:p-4">
                    {/* Category */}
                    <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                        {product.category.name}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-[13px] sm:text-sm font-medium mb-2 line-clamp-2 text-foreground leading-snug group-hover:text-tech-accent transition-colors duration-200">
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
                                                : "fill-transparent text-muted-foreground/25"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                                ({reviewStats.totalReviews})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-2 border-t border-border/40">
                        <p className="text-sm sm:text-base font-semibold text-foreground">
                            {hasMultiplePrices ? (
                                <>
                                    <span className="text-muted-foreground text-xs font-normal">From </span>
                                    {displayPrice}
                                </>
                            ) : displayPrice}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
