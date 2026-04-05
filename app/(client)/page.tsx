import FeaturedImages from "@/components/home/featured-images";
import CategoryListing from "@/components/client/product/category-listing";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover the latest laptops, electronics, and tech accessories. Shop premium brands at the best prices at LaptopBD.",
};

export default function HomePage() {
    return (
        <>
            <FeaturedImages/>
            <div className="custom-container">
                <div className="px-6 py-16 md:px-12 md:py-24">
                    <div className="mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 text-balance">
                            Premium Laptops & Electronics
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto text-balance">
                            Discover our carefully curated selection of laptops, accessories, and tech gadgets from the world&apos;s leading brands
                        </p>
                    </div>
                </div>
                <CategoryListing/>
            </div>
        </>
    )
}
