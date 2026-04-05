import FeaturedImages from "@/components/home/featured-images";
import CategoryListing from "@/components/client/product/category-listing";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Discover our carefully curated selection of pure honey and premium nuts, sourced from the finest producers. Shop premium natural organic products at KhaatiBazar.",
};

export default function HomePage() {
    return (
        <>
            <FeaturedImages/>
            <div className="custom-container">
                <div className="px-6 py-16 md:px-12 md:py-24">
                    <div className="mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 text-balance">
                            Premium Natural Products
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto text-balance">
                            Discover our carefully curated selection of pure honey and premium nuts, sourced from the finest producers
                        </p>
                    </div>
                </div>
                <CategoryListing/>
            </div>
        </>
    )
}
