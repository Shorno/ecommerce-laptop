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
    categoryName?: string
}

export async function ProductsGrid({ searchParams, categoryName }: ProductsGridProps) {
    const products = await getProducts(searchParams)

    const categories = await getActiveCategories()
    const subCategories = searchParams.category
        ? await getSubCategoriesByCategory(searchParams.category)
        : []

    return (
        <div className="space-y-4">
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 border rounded-lg px-4 py-2.5 bg-card">
                <div className="flex items-center gap-3">
                    {categoryName && (
                        <h1 className="text-sm font-semibold">
                            Products of {categoryName}
                        </h1>
                    )}
                </div>
                <ProductsSort
                    categories={categories}
                    subCategories={subCategories}
                    currentCategorySlug={searchParams.category}
                />
            </div>

            {/* Product Count */}
            <p className="text-sm text-muted-foreground">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
            </p>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-500 text-lg mb-2">No products found</p>
                    <p className="text-neutral-400 text-sm">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
