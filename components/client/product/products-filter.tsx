import { getActiveCategories } from "@/app/(client)/actions/get-active-categories"
import { getSubCategoriesByCategory } from "@/app/(client)/actions/get-subcategories-by-category"
import { FilterClient } from "@/components/client/product/filter-client"

interface ProductsFilterProps {
    categorySlug?: string
}

export async function ProductsFilter({ categorySlug }: ProductsFilterProps) {
    const categories = await getActiveCategories()
    const subCategories = categorySlug
        ? await getSubCategoriesByCategory(categorySlug)
        : []

    return (
        <FilterClient
            categories={categories}
            subCategories={subCategories}
            currentCategorySlug={categorySlug}
        />
    )
}

