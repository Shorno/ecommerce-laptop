import {getCategoriesWithProducts} from "@/app/(client)/actions/get-categories-with-products";
import {CategorySection} from "@/components/client/product/category-section";


export default async function CategoryListing() {
    const categoriesWithProducts = await getCategoriesWithProducts()

    if (categoriesWithProducts.length === 0) return null

    return (
        <div className="custom-container py-8 md:py-12">
            {categoriesWithProducts.map((category) => (
                <CategorySection key={category.id} category={category} />
            ))}
        </div>
    )
}
