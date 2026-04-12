import { db } from "@/db/config";
import { ProductCard } from "@/components/client/product/product-card";

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

    return (
        <section className="py-8 md:py-12">
            <div className="custom-container">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-7 bg-tech-accent rounded-full" />
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                            Featured Products
                        </h2>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
