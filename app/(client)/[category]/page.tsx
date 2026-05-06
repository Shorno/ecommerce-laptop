import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductsGrid } from "@/components/client/product/products-grid"
import { ProductsFilter } from "@/components/client/product/products-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryBySlug } from "@/app/(client)/actions/get-category-by-slug"
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory"
import { Metadata } from "next"
import Link from "next/link"
import { Home } from "lucide-react"


export const revalidate = 3600

type SearchParams = {
    sort?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    search?: string
}

interface CategoryProductsPageProps {
    params: Promise<{ category: string }>
    searchParams: Promise<SearchParams>
}

export async function generateMetadata({ params }: CategoryProductsPageProps): Promise<Metadata> {
    const { category: categorySlug } = await params
    const category = await getCategoryBySlug(categorySlug)

    if (!category) {
        return { title: 'Category Not Found' }
    }

    return {
        title: category.name,
        description: `Explore our ${category.name.toLowerCase()} collection. Find the best products in this category.`,
        openGraph: {
            title: category.name,
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

    const category = await getCategoryBySlug(categorySlug)

    if (!category) {
        notFound()
    }

    return (
        <div className="container mx-auto max-w-[1400px] px-4 md:px-6 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-5">
                <Link href="/" className="text-muted-foreground hover:text-tech-accent transition-colors">
                    <Home className="h-4 w-4" />
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link href="/products" className="text-muted-foreground hover:text-tech-accent transition-colors">
                    Products
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">{category.name}</span>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filter - Desktop Only */}
                <aside className="hidden lg:block w-full lg:w-60 flex-shrink-0">
                    <Suspense fallback={<FilterSkeleton />}>
                        <ProductsFilter categorySlug={categorySlug} />
                    </Suspense>
                </aside>

                {/* Products Grid */}
                <main className="flex-1 min-w-0">
                    <Suspense fallback={<ProductsGridSkeleton />}>
                        <CategoryProducts
                            categorySlug={categorySlug}
                            categoryName={category.name}
                            searchParams={searchParams}
                        />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

/** Wrapper that awaits searchParams inside Suspense — keeps the page shell static */
async function CategoryProducts({ categorySlug, categoryName, searchParams }: { categorySlug: string; categoryName: string; searchParams: Promise<SearchParams> }) {
    const filters = await searchParams
    return <ProductsGrid searchParams={{ ...filters, category: categorySlug }} categoryName={categoryName} />
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
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-9 w-44" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <Skeleton className="aspect-[4/3] w-full rounded-none" />
                        <div className="p-3.5 sm:p-4 space-y-2.5">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-4 w-14 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
