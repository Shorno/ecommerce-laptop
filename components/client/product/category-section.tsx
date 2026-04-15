import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import {ProductWithRelations} from "@/db/schema";
import {ProductCard} from "@/components/client/product/product-card";

interface CategorySectionProps {
    category: {
        id: number
        name: string
        slug: string
        products: ProductWithRelations[]
    }
    reviewStatsMap?: Record<number, { averageRating: number; totalReviews: number }>
}

export function CategorySection({ category, reviewStatsMap }: CategorySectionProps) {
    return (
        <section className="mb-10">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-7 bg-tech-accent rounded-full" />
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        {category.name}
                    </h2>
                </div>

                <Button
                    asChild
                    variant="ghost"
                    className="gap-2 text-tech-accent hover:text-tech-accent/80 hover:bg-tech-accent/5"
                >
                    <Link href={`/${category.slug}`}>
                        See All
                        <ArrowRight size={16} />
                    </Link>
                </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {category.products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        reviewStats={reviewStatsMap?.[product.id]}
                    />
                ))}
            </div>
        </section>
    )
}

