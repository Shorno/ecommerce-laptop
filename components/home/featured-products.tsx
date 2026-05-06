import { db } from "@/db/config";
import { ProductCard } from "@/components/client/product/product-card";
import {getProductReviewStats} from "@/app/actions/reviews/review-stats";

export default async function FeaturedProducts() {
    const products = await db.query.product.findMany({
        where: (product, { eq }) =>
            eq(product.isFeatured, true),
        with: {
            category: {
                columns: {
                    name: true,
                    slug: true,
                },
            },
            variants: true,
        },
        limit: 8,
        orderBy: (product, { desc }) => [desc(product.createdAt)],
    });

    if (products.length === 0) return null;

    const reviewStats = await getProductReviewStats(products.map(p => p.id))

    return (
        <section className="py-8 md:py-12">
            <div className="custom-container">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-7 bg-tech-accent rounded-full" />
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Top Picks
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground ml-4 pl-px">
                            Hand-selected refurbished laptops at unbeatable prices
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} reviewStats={reviewStats[product.id]} />
                    ))}
                </div>
            </div>
        </section>
    );
}

