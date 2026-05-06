import {notFound} from "next/navigation"
import {ArrowLeft, Star, Zap, ShieldCheck, RotateCcw, Truck} from "lucide-react"
import Link from "next/link"
import {formatPrice} from "@/utils/currency"
import getProductBySlug from "@/app/actions/products/get-product-by-slug"
import {getRelatedProducts} from "@/app/actions/products/get-related-products"
import {ProductImageGallery} from "@/components/client/product/product-image-gallery"
import {ProductPageClient} from "@/components/client/product/product-page-client"
import {SectionNav} from "@/components/client/product/section-nav"
import {RelatedProductsSidebar} from "@/components/client/product/related-products-sidebar"
import type {Metadata} from "next"
import {db} from "@/db/config"
import RichTextDisplay from "@/components/ui/rich-text-display"
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

interface SpecItem {
    label: string;
    value: string
}

interface SpecGroup {
    group: string;
    specs: SpecItem[]
}

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

const trustBadges = [
    {icon: ShieldCheck, label: "Quality Checked"},
    {icon: RotateCcw, label: "Easy Returns"},
    {icon: Truck, label: "Fast Delivery"},
]


export default async function ProductDetailsPage({params}: ProductDetailsPageProps) {
    const {slug} = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        notFound()
    }

    // Fetch data in parallel
    const [reviewStats, relatedProducts] = await Promise.all([
        getSingleProductReviewStats(product.id),
        getRelatedProducts(product.id, product.categoryId, 6),
    ])

    const keyFeatures = parseKeyFeatures(product.keyFeatures)
    const specifications = parseSpecifications(product.specifications)
    const hasDescription = !!product.description && product.description !== "<p></p>"
    const hasSpecifications = specifications.length > 0 && specifications.some(g => g.specs.length > 0)

    // Parse options for variant selector
    const parsedOptions = (product.options || []).map(o => ({
        name: o.name,
        values: (() => {
            try {
                return JSON.parse(o.values) as string[]
            } catch {
                return []
            }
        })(),
    }))

    const parsedVariants = (product.variants || []).map(v => ({
        id: v.id,
        price: v.price,
        stock: v.stock,
        inStock: v.inStock,
        optionValues: v.optionValues
            ? (() => {
                try {
                    return JSON.parse(v.optionValues) as Record<string, string>
                } catch {
                    return null
                }
            })()
            : null,
    }))

    // Build section nav items
    const sectionItems = [
        {id: "specification", label: "Specification"},
        {id: "description", label: "Description"},
        {id: "reviews", label: "Reviews", count: reviewStats.totalReviews},
    ]

    return (
        <div className="bg-tech-bg dark:bg-background min-h-screen">
            <div className="custom-container py-4 md:py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/products"
                          className="hover:text-foreground transition-colors flex items-center gap-1.5">
                        <ArrowLeft className="h-3.5 w-3.5"/>
                        Products
                    </Link>
                    <span className="text-border">/</span>
                    <Link href={`/${product.category.slug}`} className="hover:text-foreground transition-colors">
                        {product.category.name}
                    </Link>
                    {product.subCategory && (
                        <>
                            <span className="text-border">/</span>
                            <span
                                className="text-foreground/60 truncate max-w-[200px]">{product.subCategory.name}</span>
                        </>
                    )}
                </nav>

                {/* ─── Top: Product Hero Section ─── */}
                <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Column - Images */}
                        <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/20 to-muted/5">
                            <ProductImageGallery
                                mainImage={product.image}
                                additionalImages={product.images}
                                productName={product.name}
                            />
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="p-5 md:p-6 lg:p-8 flex flex-col">
                            {/* Category */}
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                                <Link href={`/${product.category.slug}`}>
                                    <span
                                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                                        {product.category.name}
                                    </span>
                                </Link>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-xl md:text-2xl lg:text-[1.65rem] font-bold text-foreground leading-tight tracking-tight mb-2">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {reviewStats.totalReviews > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`h-3.5 w-3.5 ${
                                                    reviewStats.averageRating >= s
                                                        ? "fill-amber-400 text-amber-400"
                                                        : reviewStats.averageRating >= s - 0.5
                                                            ? "fill-amber-400/50 text-amber-400"
                                                            : "fill-transparent text-muted-foreground/20"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews})
                                    </span>
                                </div>
                            )}

                            {/* Key Features */}
                            {keyFeatures.length > 0 && (
                                <div className="mb-5">
                                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                        <Zap className="h-3.5 w-3.5 text-tech-accent"/>
                                        Key Features
                                    </h2>
                                    <div className="space-y-1">
                                        {keyFeatures.map((feature, index) => (
                                            <div key={index} className="flex text-sm">
                                                {feature.label ? (
                                                    <>
                                                        <span
                                                            className="text-muted-foreground min-w-[120px] flex-shrink-0">
                                                            {feature.label}
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
                            )}

                            {/* Divider */}
                            <div className="h-px bg-border/60 mb-5"/>

                            {/* Client-side: Price/Variant Selector/Actions */}
                            <ProductPageClient
                                productId={product.id}
                                productName={product.name}
                                productImage={product.image}
                                options={parsedOptions}
                                variants={parsedVariants}
                                isFeatured={product.isFeatured}
                            />

                            {/* Trust Badges */}
                            <div className="mt-auto pt-5">
                                <div className="flex items-center gap-5 border-t border-border/40 pt-4">
                                    {trustBadges.map((badge, i) => {
                                        const Icon = badge.icon
                                        return (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <Icon className="h-3.5 w-3.5 text-muted-foreground"/>
                                                <span
                                                    className="text-xs text-muted-foreground">{badge.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Bottom: Section Nav + Content + Related Sidebar ─── */}
                <div className="mt-8 md:mt-10">
                    {/* Sticky Section Navigation */}
                    <SectionNav sections={sectionItems}/>

                    {/* Content + Sidebar grid */}
                    <div className="mt-6 flex gap-6">
                        {/* Main content — sections stacked vertically */}
                        <div className="flex-1 min-w-0 space-y-8">
                            {/* ── Specification Section ── */}
                            <section id="specification">
                                <h2 className="text-lg font-bold text-foreground mb-4">
                                    Specification
                                </h2>
                                <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
                                    {hasSpecifications ? (
                                        <div className="divide-y divide-border/40">
                                            {specifications.map((group, groupIndex) => (
                                                <div key={groupIndex}>
                                                    {group.group && (
                                                        <div className="px-4 py-2.5 bg-muted/40">
                                                            <h3 className="text-sm font-semibold text-tech-accent">
                                                                {group.group}
                                                            </h3>
                                                        </div>
                                                    )}
                                                    <div>
                                                        {group.specs.map((spec, specIndex) => (
                                                            <div key={specIndex}
                                                                 className={`grid grid-cols-[180px_1fr] text-sm ${
                                                                     specIndex % 2 === 0 ? "bg-card" : "bg-muted/15"
                                                                 } ${specIndex < group.specs.length - 1 ? "border-b border-border/30" : ""}`}>
                                                                <div
                                                                    className="px-4 py-2.5 text-muted-foreground font-medium border-r border-border/30">
                                                                    {spec.label}
                                                                </div>
                                                                <div
                                                                    className="px-4 py-2.5 text-foreground">{spec.value}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground py-12 text-center">
                                            No specifications available for this product.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* ── Description Section ── */}
                            <section id="description">
                                <h2 className="text-lg font-bold text-foreground mb-4">
                                    Description
                                </h2>
                                <div className="bg-card rounded-xl border border-border/60 p-5 md:p-6">
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
                            </section>

                            {/* ── Reviews Section ── */}
                            <section id="reviews">
                                <h2 className="text-lg font-bold text-foreground mb-4">
                                    Reviews
                                    {reviewStats.totalReviews > 0 && (
                                        <span className="text-sm font-normal text-muted-foreground ml-2">
                                            ({reviewStats.totalReviews})
                                        </span>
                                    )}
                                </h2>
                                <div className="bg-card rounded-xl border border-border/60 p-5 md:p-6">
                                    <ProductReviews productId={product.id}/>
                                </div>
                            </section>
                        </div>

                        {/* Related Products Sidebar — desktop only */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <RelatedProductsSidebar products={relatedProducts as any}/>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}
