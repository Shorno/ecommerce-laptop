import HeroCarousel from "@/components/home/hero-carousel";
import getFeaturedImages from "@/app/(admin)/admin/dashboard/featured/action/get-featured-images";

export default async function FeaturedImages(){
    const featuredImages = await getFeaturedImages()

    return (
        <HeroCarousel featuredImages={featuredImages}/>
    )
}