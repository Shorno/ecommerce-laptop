import Image from "next/image"
import Link from "next/link"
import {ArrowRight} from "lucide-react"
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory";

export default async function CategoryGrid() {
    const categories = await getCategoryWithSubcategory()

    if (categories.length === 0) return null

    return (
        <section className="py-8 md:py-12">
            <div className="custom-container">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-7 bg-tech-accent rounded-full"/>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                            Browse by Category
                        </h2>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/${category.slug}`}
                            className="group relative block"
                        >
                            <div className="relative h-36 sm:h-40 md:h-44 rounded-xl overflow-hidden bg-muted">
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-semibold text-sm md:text-base leading-snug">
                                        {category.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                        <span className="text-white/80 text-xs">Browse</span>
                                        <ArrowRight className="h-3 w-3 text-white/80"/>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
