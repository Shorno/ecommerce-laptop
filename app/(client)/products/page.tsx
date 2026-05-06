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
    title : "Products",
    description: "Browse premium refurbished laptops and electronics at ROWTECH. Quality inspected, warranty included.",
};

export const revalidate = 3600


export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    return (
        <div className="bg-tech-bg dark:bg-background min-h-screen">
            <div className="custom-container py-6 md:py-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1.5">
                        All Products
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Browse our collection of quality-checked refurbished devices
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Sidebar Filter - Desktop Only */}
                    <aside className="hidden lg:block w-60 flex-shrink-0">
                        <Suspense fallback={<FilterSkeleton />}>
                            <ProductsFilter />
                        </Suspense>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1 min-w-0">
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
        <div className="space-y-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-16 w-full rounded-lg" />
        </div>
    )
}

function ProductsGridSkeleton() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-9 w-44" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
                ))}
            </div>
        </div>
    )
}
