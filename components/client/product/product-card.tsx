"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {formatPrice} from "@/utils/currency";
import {Eye} from "lucide-react"

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
}

export function ProductCard({ product }: ProductCardProps) {
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
        <Link href={`/product/${product.slug}`}>
            <Card className="group h-full flex flex-col py-0 overflow-hidden border border-border transition-all duration-300 cursor-pointer bg-card">
                {/* Image Container */}
                <div className="relative w-full aspect-[5/4] bg-white overflow-hidden p-2">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {product.isFeatured && (
                            <Badge className="bg-tech-accent text-white border-0 text-xs px-2 py-0.5">
                                Featured
                            </Badge>
                        )}
                        {allOutOfStock && (
                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                Out of Stock
                            </Badge>
                        )}
                    </div>

                    {/* Variant count badge */}
                    {variants.length > 1 && (
                        <div className="absolute top-2 right-2 z-10">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                {variants.length} variants
                            </Badge>
                        </div>
                    )}

                    {/* Product Image */}
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>

                {/* Content */}
                <CardContent className="flex flex-col flex-grow p-3 border-t border-border/50">
                    {/* Product Name */}
                    <h3 className="text-xs sm:text-sm font-medium mb-1.5 line-clamp-2 text-foreground group-hover:text-tech-accent transition-colors leading-snug">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-2 mt-auto">
                        <p className="text-base font-bold text-tech-accent">
                            {hasMultiplePrices ? `From ${displayPrice}` : displayPrice}
                        </p>
                    </div>

                    {/* View Details Link */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 gap-1.5 text-sm font-medium border-tech-accent/30 text-tech-accent hover:bg-tech-accent hover:text-white transition-colors"
                    >
                        <Eye size={14} />
                        View Details
                    </Button>
                </CardContent>
            </Card>
        </Link>
    )
}
