import Image from "next/image"
import Link from "next/link"
import {formatPrice} from "@/utils/currency"

interface RelatedProduct {
    id: number
    name: string
    slug: string
    image: string
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

interface RelatedProductsSidebarProps {
    products: RelatedProduct[]
}

export function RelatedProductsSidebar({products}: RelatedProductsSidebarProps) {
    if (products.length === 0) return null

    return (
        <div className="sticky top-32">
            <h3 className="text-sm font-bold text-foreground mb-4">
                Similar Products
            </h3>
            <div className="space-y-3">
                {products.map((product) => {
                    const prices = (product.variants || []).map(v => parseFloat(v.price))
                    const minPrice = product.minPrice
                        ? formatPrice(product.minPrice)
                        : prices.length > 0
                            ? formatPrice(Math.min(...prices).toString())
                            : "Price TBD"

                    return (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group flex gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-muted/30 border border-border/40">
                                <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-1"
                                    sizes="56px"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug group-hover:text-tech-accent transition-colors">
                                    {product.name}
                                </p>
                                <p className="text-xs font-semibold text-tech-accent mt-1">
                                    {minPrice}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
