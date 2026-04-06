import Image from "next/image"
import Link from "next/link"
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory";

export default async function CategoryGrid() {
    const categories = await getCategoryWithSubcategory()

    if (categories.length === 0) return null

    return (
        <section className="py-8 md:py-12">
            <div className="custom-container">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-7 bg-tech-accent rounded-full" />
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        Browse Categories
                    </h2>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/${category.slug}`}
                            className="group"
                        >
                            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-3 hover:border-tech-accent/40 hover:shadow-md transition-all duration-200">
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted ring-2 ring-border group-hover:ring-tech-accent/30 transition-all">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        sizes="80px"
                                    />
                                </div>
                                <span className="text-sm font-medium text-center text-foreground group-hover:text-tech-accent transition-colors line-clamp-2">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
