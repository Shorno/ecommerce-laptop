import { ProductCard } from "./product-card"
import getAllProducts from "@/app/actions/products/get-all-products";
import {getProductReviewStats} from "@/app/actions/reviews/review-stats";


export default async function ProductList() {
    const products = await getAllProducts()
    const productIds = products.map(p => p.id)
    const reviewStats = await getProductReviewStats(productIds)

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="bg-tech-bg dark:bg-background px-6 py-12 md:px-12 md:py-16">
                <div className="mx-auto max-w-[1400px]">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1.5">
                        All Products
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Browse our full collection of quality-checked devices
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-6 py-10 md:px-12 md:py-14">
                <div className="mx-auto max-w-[1400px]">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                reviewStats={reviewStats[product.id]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
