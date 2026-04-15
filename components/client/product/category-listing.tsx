import {getCategoriesWithProducts} from "@/app/(client)/actions/get-categories-with-products";
import {CategorySection} from "@/components/client/product/category-section";
import {getProductReviewStats} from "@/app/actions/reviews/review-stats";


export default async function CategoryListing() {
    const categoriesWithProducts = await getCategoriesWithProducts()

    if (categoriesWithProducts.length === 0) return null

    // Batch fetch review stats for all products across categories
    const allProductIds = categoriesWithProducts.flatMap(c => c.products.map(p => p.id))
    const reviewStatsMap = await getProductReviewStats(allProductIds)

    return (
        <div className="custom-container py-8 md:py-12">
            {categoriesWithProducts.map((category) => (
                <CategorySection
                    key={category.id}
                    category={category}
                    reviewStatsMap={reviewStatsMap}
                />
            ))}
        </div>
    )
}

