import FeaturedImages from "@/components/home/featured-images";
import CategoryGrid from "@/components/home/category-grid";
import FeaturedProducts from "@/components/home/featured-products";
import PromoBanner from "@/components/home/promo-banner";
import CategoryListing from "@/components/client/product/category-listing";
import ValueProps from "@/components/home/value-props";
import BrandShowcase from "@/components/home/brand-showcase";
import NewsletterSection from "@/components/home/newsletter-section";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover the latest laptops, electronics, and tech accessories. Shop premium brands at the best prices at LaptopBD.",
};

export const revalidate = 3600

function SectionSkeleton() {
    return (
        <div className="custom-container py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-72 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

function PromoBannerSkeleton() {
    return (
        <div className="custom-container py-6 md:py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
            </div>
        </div>
    );
}

function BrandSkeleton() {
    return (
        <div className="custom-container py-8">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/2] w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

export default function HomePage() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "LaptopBD",
                "url": siteUrl,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${siteUrl}/products?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            },
            {
                "@type": "Organization",
                "name": "LaptopBD",
                "url": siteUrl,
                "logo": `${siteUrl}/icon.png`,
            },
        ],
    }

    return (
        <div className="bg-tech-bg dark:bg-background min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")}}
            />
            {/* 1. Hero Carousel + Side Banners */}
            <FeaturedImages />

            {/* 2. Browse Categories */}
            <Suspense fallback={
                <div className="custom-container py-8">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            }>
                <CategoryGrid />
            </Suspense>

            {/* 3. Featured Products */}
            <Suspense fallback={<SectionSkeleton />}>
                <FeaturedProducts />
            </Suspense>

            {/* 4. Promotional Banners — visual break */}
            <Suspense fallback={<PromoBannerSkeleton />}>
                <PromoBanner />
            </Suspense>

            {/* 5. Category-wise Product Listings */}
            <Suspense fallback={<SectionSkeleton />}>
                <CategoryListing />
            </Suspense>

            {/* 6. Value Propositions — trust signals */}
            <ValueProps />

            {/* 7. Brand Showcase */}
            <Suspense fallback={<BrandSkeleton />}>
                <BrandShowcase />
            </Suspense>

            {/* 8. Newsletter CTA */}
            <NewsletterSection />
        </div>
    )
}
