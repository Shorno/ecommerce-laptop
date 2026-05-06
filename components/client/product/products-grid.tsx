import { getProducts } from "@/app/(client)/actions/get-products"
import { ProductCard } from "@/components/client/product/product-card"
import { ProductsSort } from "@/components/client/product/products-sort"
import { getActiveCategories } from "@/app/(client)/actions/get-active-categories"
import { getSubCategoriesByCategory } from "@/app/(client)/actions/get-subcategories-by-category"
import {getProductReviewStats} from "@/app/actions/reviews/review-stats"
import {PackageSearch} from "lucide-react"

interface ProductsGridProps {
    searchParams: {
        category?: string
        subcategory?: string
        sort?: string
        minPrice?: string
        maxPrice?: string
        inStock?: string
        search?: string
    }
    categoryName?: string
}

export async function ProductsGrid({ searchParams, categoryName }: ProductsGridProps) {
    const products = await getProducts(searchParams)

    const categories = await getActiveCategories()
    const subCategories = searchParams.category
        ? await getSubCategoriesByCategory(searchParams.category)
        : []

    const reviewStatsMap = await getProductReviewStats(products.map(p => p.id))

    return (
        <div className="space-y-5">
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    {categoryName && (
                        <span className="font-medium text-foreground">{categoryName} · </span>
                    )}
                    {products.length} {products.length === 1 ? "product" : "products"}
                </p>
                <ProductsSort
                    categories={categories}
                    subCategories={subCategories}
                    currentCategorySlug={searchParams.category}
                />
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <PackageSearch className="w-7 h-7 text-muted-foreground"/>
                    </div>
                    <p className="text-foreground font-medium mb-1">No products found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} reviewStats={reviewStatsMap[product.id]} />
                    ))}
                </div>
            )}
        </div>
    )
}
