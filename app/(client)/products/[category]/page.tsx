import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductsGrid } from "@/components/client/product/products-grid"
import { ProductsFilter } from "@/components/client/product/products-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryBySlug } from "@/app/(client)/actions/get-category-by-slug"
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory"
import {Metadata} from "next";


export const revalidate = 3600

interface CategoryProductsPageProps {
    params: Promise<{ category: string }>
    searchParams: Promise<{
        subcategory?: string
        sort?: string
        minPrice?: string
        maxPrice?: string
        inStock?: string
        search?: string
    }>
}

export async function generateMetadata({ params, searchParams }: CategoryProductsPageProps): Promise<Metadata> {
    const { category: categorySlug } = await params
    const filters = await searchParams

    const category = await getCategoryBySlug(categorySlug)

    if (!category) {
        return {
            title: 'Category Not Found'
        }
    }

    let title = category.name
    if (filters.subcategory) {
        const capitalizedSubcategory = filters.subcategory.charAt(0).toUpperCase() + filters.subcategory.slice(1)
        title += ` - ${capitalizedSubcategory}`
    }
    if (filters.search) {
        title += ` - Search: ${filters.search}`
    }

    return {
        title: title,
        description: `Explore our ${category.name.toLowerCase()} collection. Find the best products in this category.`,
        openGraph: {
            title: title,
            description: `Explore our ${category.name.toLowerCase()} collection`,
        },
    }
}


export async function generateStaticParams() {
    const categories = await getCategoryWithSubcategory()

    return categories.map((category) => ({
        category: category.slug,
    }))
}

export default async function CategoryProductsPage({ params, searchParams }: CategoryProductsPageProps) {
    const { category: categorySlug } = await params
    const filters = await searchParams

    const category = await getCategoryBySlug(categorySlug)

    if (!category) {
        notFound()
    }

    return (
        <div className="custom-container py-8 md:py-12">
            <div className="px-4 md:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-light mb-2">
                        {category.name}
                    </h1>
                    <p className="opacity-60">
                        Explore our {category.name.toLowerCase()} collection
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
                                searchParams={{ ...filters, category: categorySlug }}
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
