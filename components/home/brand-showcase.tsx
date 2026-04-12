import Image from "next/image"
import {db} from "@/db/config"
import {brand} from "@/db/schema/brand"
import {eq, asc} from "drizzle-orm"

export default async function BrandShowcase() {
    const brands = await db
        .select()
        .from(brand)
        .where(eq(brand.isActive, true))
        .orderBy(asc(brand.displayOrder), asc(brand.name))

    if (brands.length === 0) return null

    return (
        <section className="py-8 md:py-12" id="brand-showcase">
            <div className="custom-container">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-7 bg-tech-accent rounded-full"/>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        Our Brands
                    </h2>
                </div>

                {/* Brand Logo Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {brands.map((b) => (
                        <div
                            key={b.id}
                            className="group bg-card border border-border rounded-lg p-4 flex items-center justify-center hover:border-tech-accent/40 hover:shadow-md transition-all duration-200 aspect-[3/2]"
                        >
                            <div className="relative w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                <Image
                                    src={b.logo}
                                    alt={b.name}
                                    fill
                                    className="object-contain p-1"
                                    sizes="120px"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
