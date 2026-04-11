import { Suspense } from "react"
import { ProductsGrid } from "@/components/client/product/products-grid"
import { ProductsFilter } from "@/components/client/product/products-filter"
import { Skeleton } from "@/components/ui/skeleton"
import type {Metadata} from "next";

type SearchParams = {
    category?: string
    subcategory?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    search?: string
}

interface ProductsPageProps {
    searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
    title : "Products"
};

export const revalidate = 3600


export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    return (
        <div className="custom-container py-8 md:py-12">
            <div className="px-4 md:px-6">
                {/* Header — static, prerendered */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-light mb-2">
                        Our Products
                    </h1>
                    <p className="opacity-60">
                        Browse our collection of laptops and electronics
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter - Desktop Only */}
                    <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
                        <Suspense fallback={<FilterSkeleton />}>
                            <ProductsFilter />
                        </Suspense>
                    </aside>

                    {/* Products Grid — streams in based on search params */}
                    <main className="flex-1">
                        <Suspense fallback={<ProductsGridSkeleton />}>
                            <AllProducts searchParams={searchParams} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    )
}

/** Wrapper that awaits searchParams inside Suspense — keeps the page shell static */
async function AllProducts({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    return <ProductsGrid searchParams={params} />
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
