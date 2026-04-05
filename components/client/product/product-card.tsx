"use client"

import Image from "next/image"
import Link from "next/link"
import {Loader2, ShoppingCart, Zap} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ProductWithRelations} from "@/db/schema";
import {toast} from "sonner";
import {useCartActions, useCartItems} from "@/stote/cart-sotre";
import {formatPrice} from "@/utils/currency";
import {authClient} from "@/lib/auth-client";
import { useRouter } from "next/navigation"
import {useTransition} from "react";

interface ProductCardProps {
    product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
    const session = authClient.useSession();
    const [isPending, startTransition] = useTransition()

    const router = useRouter()
    const items = useCartItems()
    const {addItem, buyNow} = useCartActions()
    const isAuthenticated = !!session.data?.user;


    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock");
            return;
        }

        const cartItem = items.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity >= (product.stockQuantity ?? Infinity)) {
            toast.warning("Maximum quantity in cart");
            return;
        }

        addItem(product, isAuthenticated);
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`})

    }

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock");
            return;
        }

        startTransition(async () => {
            await buyNow(product, 1, isAuthenticated)
            toast.success("Proceeding to checkout", {
                description: `1 x ${product.name}`
            })
            router.push("/checkout")
        })
    }

    const isOutOfStock = !product.inStock || product.stockQuantity === 0;

    return (
        <Link href={`/product/${product.slug}`}>
            <Card className="group h-full flex flex-col py-0 overflow-hidden border border-border hover:border-tech-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer bg-card">
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-white overflow-hidden p-3">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {product.isFeatured && (
                            <Badge className="bg-tech-accent text-white border-0 text-xs px-2 py-0.5">
                                Featured
                            </Badge>
                        )}
                        {isOutOfStock && (
                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                Out of Stock
                            </Badge>
                        )}
                    </div>

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
                <CardContent className="flex flex-col flex-grow p-3 md:p-4 border-t border-border/50">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium mb-2 line-clamp-2 text-foreground group-hover:text-tech-accent transition-colors leading-snug min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    {/* Size */}
                    <p className="text-xs text-muted-foreground mb-2">
                        {product.size}
                    </p>

                    {/* Price */}
                    <div className="mb-3 mt-auto">
                        <p className="text-lg md:text-xl font-bold text-tech-accent">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {/* Stock indicator */}
                    {!isOutOfStock && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3 font-medium">
                            In Stock
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-border hover:border-tech-accent hover:text-tech-accent transition-colors disabled:opacity-50"
                        >
                            <ShoppingCart size={15} />
                        </Button>

                        <Button
                            onClick={handleBuyNow}
                            disabled={isOutOfStock || isPending}
                            className="flex-1 h-9 gap-1.5 bg-tech-accent hover:bg-tech-accent/90 text-white text-sm font-medium disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span className="hidden sm:inline">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={14} />
                                    Buy Now
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
