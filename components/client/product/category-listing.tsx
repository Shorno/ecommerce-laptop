import {getCategoriesWithProducts} from "@/app/(client)/actions/get-categories-with-products";
import {CategorySection} from "@/components/client/product/category-section";


export default async function CategoryListing() {
    const categoriesWithProducts = await getCategoriesWithProducts()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
                Our Products
            </h1>

            {categoriesWithProducts.length === 0 ? (
                <p className="text-center py-12 opacity-60">
                    No products available at the moment.
                </p>
            ) : (
                <div className="space-y-12">
                    {categoriesWithProducts.map((category) => (
                        <CategorySection key={category.id} category={category} />
                    ))}
                </div>
            )}
        </div>
    )
}
