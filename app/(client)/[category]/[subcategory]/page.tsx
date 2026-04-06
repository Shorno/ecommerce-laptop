import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductsGrid } from "@/components/client/product/products-grid"
import { ProductsFilter } from "@/components/client/product/products-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryBySlug } from "@/app/(client)/actions/get-category-by-slug"
import { getSubCategoryBySlug } from "@/app/(client)/actions/get-subcategory-by-slug"
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"


export const revalidate = 3600

interface SubcategoryProductsPageProps {
    params: Promise<{ category: string; subcategory: string }>
    searchParams: Promise<{
        sort?: string
        minPrice?: string
        maxPrice?: string
        inStock?: string
        search?: string
    }>
}

export async function generateMetadata({ params }: SubcategoryProductsPageProps): Promise<Metadata> {
    const { category: categorySlug, subcategory: subcategorySlug } = await params

    const category = await getCategoryBySlug(categorySlug)
    const subCategory = await getSubCategoryBySlug(subcategorySlug, categorySlug)

    if (!category || !subCategory) {
        return {
            title: 'Not Found'
        }
    }

    const title = `${subCategory.name} - ${category.name}`

    return {
        title: title,
        description: `Explore our ${subCategory.name.toLowerCase()} collection in ${category.name.toLowerCase()}. Find the best products.`,
        openGraph: {
            title: title,
            description: `Explore our ${subCategory.name.toLowerCase()} collection in ${category.name.toLowerCase()}`,
        },
    }
}


export async function generateStaticParams() {
    const categories = await getCategoryWithSubcategory()

    const params: { category: string; subcategory: string }[] = []

    for (const cat of categories) {
        for (const sub of cat.subCategory) {
            params.push({
                category: cat.slug,
                subcategory: sub.slug,
            })
        }
    }

    return params
}

export default async function SubcategoryProductsPage({ params, searchParams }: SubcategoryProductsPageProps) {
    const { category: categorySlug, subcategory: subcategorySlug } = await params
    const filters = await searchParams

    const category = await getCategoryBySlug(categorySlug)
    if (!category) {
        notFound()
    }

    const subCategory = await getSubCategoryBySlug(subcategorySlug, categorySlug)
    if (!subCategory) {
        notFound()
    }

    return (
        <div className="custom-container py-8 md:py-12">
            <div className="px-4 md:px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <Link href={`/${categorySlug}`} className="hover:text-foreground transition-colors">
                        {category.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium">{subCategory.name}</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-light mb-2">
                        {subCategory.name}
                    </h1>
                    <p className="opacity-60">
                        Explore our {subCategory.name.toLowerCase()} in {category.name.toLowerCase()}
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter - Desktop Only */}
                    <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
                        <Suspense fallback={<FilterSkeleton />}>
                            <ProductsFilter categorySlug={categorySlug} />
                        </Suspense>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <Suspense fallback={<ProductsGridSkeleton />}>
                            <ProductsGrid
                                searchParams={{ ...filters, category: categorySlug, subcategory: subcategorySlug }}
                            />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    )
}

function FilterSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    )
}

function ProductsGridSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                ))}
            </div>
        </div>
    )
}
