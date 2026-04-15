import {notFound} from "next/navigation"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Button} from "@/components/ui/button"
import {ArrowLeft, Star, Zap} from "lucide-react"
import Link from "next/link"
import {formatPrice} from "@/utils/currency"
import getProductBySlug from "@/app/actions/products/get-product-by-slug"
import {ProductImageGallery} from "@/components/client/product/product-image-gallery"
import {ProductPageClient} from "@/components/client/product/product-page-client"
import type {Metadata} from "next"
import {db} from "@/db/config"
import RichTextDisplay from "@/components/ui/rich-text-display"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import ProductReviews from "@/components/client/product/product-reviews"
import {getSingleProductReviewStats} from "@/app/actions/reviews/review-stats"

export const revalidate = 3600

interface ProductDetailsPageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const products = await db.query.product.findMany({
        columns: {slug: true},
    })
    return products.map((p) => ({slug: p.slug}))
}

export async function generateMetadata({params}: ProductDetailsPageProps): Promise<Metadata> {
    const {slug} = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        return {title: 'Product Not Found'}
    }

    const displayPrice = product.minPrice ? formatPrice(product.minPrice) : "Price varies"

    return {
        title: product.name,
        description: `${product.name} - ${product.category.name}. ${displayPrice}`,
        openGraph: {
            title: product.name,
            description: `${product.name} - ${product.category.name}. ${displayPrice}`,
            images: [{url: product.image, width: 1200, height: 630, alt: product.name}],
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

// Parse key features
function parseKeyFeatures(raw: string | null): { label: string; value: string }[] {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.filter((f: { label: string; value: string }) => f.label || f.value)
        return []
    } catch {
        return raw
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .map(line => {
                const colonIndex = line.indexOf(":")
                if (colonIndex > 0) {
                    return {label: line.substring(0, colonIndex).trim(), value: line.substring(colonIndex + 1).trim()}
                }
                return {label: "", value: line}
            })
    }
}

interface SpecItem { label: string; value: string }
interface SpecGroup { group: string; specs: SpecItem[] }

function parseSpecifications(raw: string | null): SpecGroup[] {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
        return []
    } catch {
        return []
    }
}


export default async function ProductDetailsPage({params}: ProductDetailsPageProps) {
    const {slug} = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    const reviewStats = await getSingleProductReviewStats(product.id)

    const keyFeatures = parseKeyFeatures(product.keyFeatures)
    const specifications = parseSpecifications(product.specifications)
    const hasDescription = !!product.description && product.description !== "<p></p>"
    const hasSpecifications = specifications.length > 0 && specifications.some(g => g.specs.length > 0)
    const hasBottomContent = true // Always show: reviews tab is always present

    // Parse options for variant selector
    const parsedOptions = (product.options || []).map(o => ({
        name: o.name,
        values: (() => { try { return JSON.parse(o.values) as string[] } catch { return [] } })(),
    }))

    const parsedVariants = (product.variants || []).map(v => ({
        id: v.id,
        price: v.price,
        stock: v.stock,
        inStock: v.inStock,
        optionValues: v.optionValues
            ? (() => { try { return JSON.parse(v.optionValues) as Record<string, string> } catch { return null } })()
            : null,
    }))

    const hasMultipleVariants = parsedVariants.length > 1

    return (
        <div className="container mx-auto max-w-[1400px] px-4 md:px-6 py-4 md:py-6">
            {/* Back Button */}
            <div className="mb-4">
                <Link href="/products">
                    <Button variant="ghost" size="sm" className="gap-2 h-8">
                        <ArrowLeft className="h-3.5 w-3.5"/>
                        Back to Products
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
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
                        {reviewStats.totalReviews > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`h-3.5 w-3.5 ${
                                                reviewStats.averageRating >= s
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : reviewStats.averageRating >= s - 0.5
                                                        ? "fill-yellow-400/50 text-yellow-400"
                                                        : "fill-transparent text-muted-foreground/20"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {reviewStats.averageRating.toFixed(1)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "review" : "reviews"})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Key Features */}
                    {keyFeatures.length > 0 && (
                        <>
                            <Separator/>
                            <div id="key-features">
                                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                                    <Zap className="h-4 w-4 text-tech-accent"/>
                                    Key Features
                                </h2>
                                <div className="space-y-1.5">
                                    {keyFeatures.map((feature, index) => (
                                        <div key={index} className="flex text-sm">
                                            {feature.label ? (
                                                <>
                                                    <span className="text-muted-foreground min-w-[120px] flex-shrink-0">
                                                        {feature.label}:
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {feature.value}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-foreground">• {feature.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator/>

                    {/* Client-side: Price/Variant Selector/Actions */}
                    <ProductPageClient
                        productId={product.id}
                        productName={product.name}
                        productImage={product.image}
                        options={parsedOptions}
                        variants={parsedVariants}
                        isFeatured={product.isFeatured}
                    />
                </div>
            </div>

            {/* ─── Bottom Tabbed Section ─── */}
            {hasBottomContent && (
                <div className="mt-10 md:mt-14">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full grid grid-cols-3 h-14 p-1.5 rounded-xl">
                            <TabsTrigger value="description" className="text-base font-semibold rounded-lg">
                                Description
                            </TabsTrigger>
                            <TabsTrigger value="specification" className="text-base font-semibold rounded-lg">
                                Specification
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="text-base font-semibold rounded-lg">
                                Reviews
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-6">
                            <div className="max-w-4xl">
                                {hasDescription ? (
                                    <RichTextDisplay html={product.description!}
                                        className="prose prose-sm dark:prose-invert max-w-none text-foreground
                                            prose-headings:text-foreground prose-headings:font-semibold
                                            prose-p:text-muted-foreground prose-p:leading-relaxed
                                            prose-li:text-muted-foreground prose-strong:text-foreground"/>
                                ) : (
                                    <p className="text-sm text-muted-foreground py-12 text-center">
                                        No description available for this product.
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="specification" className="mt-6">
                            <div className="max-w-4xl space-y-6">
                                {hasSpecifications ? (
                                    specifications.map((group, groupIndex) => (
                                        <div key={groupIndex}>
                                            {group.group && (
                                                <h3 className="text-sm font-semibold text-foreground bg-muted/50 px-4 py-2.5 rounded-t-lg border border-border border-b-0">
                                                    {group.group}
                                                </h3>
                                            )}
                                            <div className={`border border-border overflow-hidden ${group.group ? "rounded-b-lg" : "rounded-lg"}`}>
                                                {group.specs.map((spec, specIndex) => (
                                                    <div key={specIndex}
                                                         className={`grid grid-cols-[200px_1fr] text-sm ${
                                                             specIndex % 2 === 0 ? "bg-card" : "bg-muted/20"
                                                         } ${specIndex < group.specs.length - 1 ? "border-b border-border" : ""}`}>
                                                        <div className="px-4 py-2.5 text-muted-foreground font-medium border-r border-border">{spec.label}</div>
                                                        <div className="px-4 py-2.5 text-foreground">{spec.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground py-12 text-center">
                                        No specifications available for this product.
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <div className="max-w-4xl">
                                <ProductReviews productId={product.id}/>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    )
}
