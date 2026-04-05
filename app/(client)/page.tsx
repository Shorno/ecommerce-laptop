import FeaturedImages from "@/components/home/featured-images";
import CategoryListing from "@/components/client/product/category-listing";
import CategoryGrid from "@/components/home/category-grid";
import FeaturedProducts from "@/components/home/featured-products";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover the latest laptops, electronics, and tech accessories. Shop premium brands at the best prices at LaptopBD.",
};

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

export default function HomePage() {
    return (
        <div className="bg-tech-bg dark:bg-background min-h-screen">
            {/* Hero Carousel */}
            <FeaturedImages />

            {/* Category Grid */}
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

            {/* Featured Products */}
            <Suspense fallback={<SectionSkeleton />}>
                <FeaturedProducts />
            </Suspense>

            {/* Category-wise Product Listings */}
            <Suspense fallback={<SectionSkeleton />}>
                <CategoryListing />
            </Suspense>
        </div>
    )
}
