import { getProducts } from "@/app/(client)/actions/get-products"
import { ProductCard } from "@/components/client/product/product-card"
import { ProductsSort } from "@/components/client/product/products-sort"
import { getActiveCategories } from "@/app/(client)/actions/get-active-categories"
import { getSubCategoriesByCategory } from "@/app/(client)/actions/get-subcategories-by-category"

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
}

export async function ProductsGrid({ searchParams }: ProductsGridProps) {
    const products = await getProducts(searchParams)

    const categories = await getActiveCategories()
    const subCategories = searchParams.category
        ? await getSubCategoriesByCategory(searchParams.category)
        : []

    return (
        <div className="space-y-6">
            {/* Sort and Results Count */}
            <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                <p className="text-sm text-neutral-600">
                    {products.length} {products.length === 1 ? "product" : "products"} found
                </p>
                <ProductsSort
                    categories={categories}
                    subCategories={subCategories}
                    currentCategorySlug={searchParams.category}
                />
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-500 text-lg mb-2">No products found</p>
                    <p className="text-neutral-400 text-sm">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
