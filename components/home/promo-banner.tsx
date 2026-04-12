import Image from "next/image"
import Link from "next/link"
import {ArrowRight} from "lucide-react"
import {db} from "@/db/config"
import {featuredImages} from "@/db/schema/featured-images"
import {eq, asc} from "drizzle-orm"

export default async function PromoBanner() {
    const promos = await db
        .select()
        .from(featuredImages)
        .where(eq(featuredImages.placement, "promo"))
        .orderBy(asc(featuredImages.id))
        .limit(2)

    if (promos.length === 0) return null

    return (
        <section className="py-6 md:py-10">
            <div className="custom-container">
                <div className={`grid gap-4 ${promos.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                    {promos.map((promo, index) => {
                        const isFirst = index === 0
                        return (
                            <Link
                                key={promo.id}
                                href={promo.ctaLink || "#"}
                                className="group relative block overflow-hidden rounded-xl"
                                id={`promo-banner-${promo.id}`}
                            >
                                <div className="relative w-full h-[180px] sm:h-[220px] md:h-[240px]">
                                    {/* Background Image */}
                                    <Image
                                        src={promo.image || "/placeholder.svg"}
                                        alt={promo.title || "Promotional Banner"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />

                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 ${
                                        isFirst
                                            ? "bg-gradient-to-r from-tech-navy/85 via-tech-navy/50 to-transparent"
                                            : "bg-gradient-to-r from-tech-accent/80 via-tech-accent/40 to-transparent"
                                    }`}/>

                                    {/* Text Content */}
                                    <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                                        <div className="max-w-xs">
                                            {promo.title && (
                                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight">
                                                    {promo.title}
                                                </h3>
                                            )}
                                            {promo.subtitle && (
                                                <p className="text-sm text-white/80 mb-3 line-clamp-2">
                                                    {promo.subtitle}
                                                </p>
                                            )}
                                            {promo.cta && (
                                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
                                                    {promo.cta}
                                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
