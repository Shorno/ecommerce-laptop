import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/utils/currency"
import getProductBySlug from "@/app/actions/products/get-product-by-slug"
import { ProductImageGallery } from "@/components/client/product/product-image-gallery"
import { ProductDetailsActions } from "@/components/client/product/product-details-actions"
import type {Metadata} from "next";

interface ProductDetailsPageProps {
    params: Promise<{ slug: string }>
}


export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
    const { slug } = await params

    const product = await getProductBySlug(slug)

    if (!product) {
        return {
            title: 'Product Not Found'
        }
    }

    return {
        title: product.name,
        description: `${product.name} - ${product.category.name}. Price: ${formatPrice(product.price)}`,
        openGraph: {
            title: product.name,
            description: `${product.name} - ${product.category.name}. Price: ${formatPrice(product.price)}`,
            images: [
                {
                    url: product.image,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: `${product.name} - ${product.category.name}`,
            images: [product.image],
        },
    }
}


export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { slug } = await params

    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-6">
            {/* Back Button */}
            <div className="mb-4">
                <Link href="/products">
                    <Button variant="ghost" size="sm" className="gap-2 h-8">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Products
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column - Images */}
                <div>
                    <ProductImageGallery
                        mainImage={product.image}
                        additionalImages={product.images}
                        productName={product.name}
                    />
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-4">
                    {/* Category & Featured Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/${product.category.slug}`}>
                            <Badge variant="secondary" className="text-xs hover:bg-secondary/80 cursor-pointer">
                                {product.category.name}
                            </Badge>
                        </Link>
                        {product.isFeatured && (
                            <Badge className="text-xs bg-tech-accent text-white border-0">Featured</Badge>
                        )}
                        {product.inStock ? (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                In Stock
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="text-xs">
                                Out of Stock
                            </Badge>
                        )}
                    </div>

                    {/* Product Name */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">
                            {product.name}
                        </h1>
                        {product.subCategory && (
                            <p className="text-sm text-muted-foreground">
                                {product.subCategory.name}
                            </p>
                        )}
                    </div>

                    <Separator className="my-3" />

                    {/* Price */}
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-tech-accent">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {/* Product Details */}
                    <Card>
                        <CardContent className="pt-4 pb-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Size:</span>
                                <span className="font-medium">{product.size}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Stock Quantity:</span>
                                <span className="font-medium">
                                    {product.stockQuantity > 0 ? product.stockQuantity : "Out of stock"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <ProductDetailsActions product={product} />
                </div>
            </div>
        </div>
    )
}
