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
}

export function CategorySection({ category }: CategorySectionProps) {
    return (
        <section className="mb-12">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                    {category.name}
                </h2>

                <Button
                    asChild
                    variant="ghost"
                    className="gap-2"
                >
                    <Link href={`/products/${category.slug}`}>
                        See All
                        <ArrowRight size={16} />
                    </Link>
                </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {category.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
