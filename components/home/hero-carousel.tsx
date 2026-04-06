"use client"
import React, {useState, useEffect, useCallback} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {FeaturedImage} from "@/db/schema"
import Image from "next/image";
import Link from "next/link";

interface HeroCarouselProps {
    featuredImages: FeaturedImage[]
}

export default function HeroCarousel({featuredImages}: HeroCarouselProps) {
    const [current, setCurrent] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)

    // Filter by admin-controlled placement
    const carouselSlides = featuredImages.filter(f => f.placement === "carousel")
    const sideBanners = featuredImages.filter(f => f.placement === "side").slice(0, 2)

    useEffect(() => {
        if (!isAutoPlay || carouselSlides.length <= 1) return

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % carouselSlides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlay, carouselSlides.length])

    const goToSlide = useCallback((index: number) => {
        setCurrent(index)
        setIsAutoPlay(false)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % carouselSlides.length)
        setIsAutoPlay(false)
    }, [carouselSlides.length])

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
        setIsAutoPlay(false)
    }, [carouselSlides.length])

    if (featuredImages.length === 0) return null

    return (
        <div>
            <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-2 pb-4">
                <div className="flex gap-3 lg:gap-4">
                    {/* Main Carousel — left side */}
                    <div className={`relative overflow-hidden rounded-lg ${sideBanners.length > 0 ? "w-full lg:w-[65%]" : "w-full"}`}>
                        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[360px] lg:h-[420px]">
                            {carouselSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                        index === current
                                            ? "opacity-100 translate-x-0"
                                            : index > current
                                                ? "opacity-0 translate-x-8"
                                                : "opacity-0 -translate-x-8"
                                    }`}
                                    role="group"
                                    aria-label={`Slide ${index + 1} of ${carouselSlides.length}`}
                                >
                                    <Image
                                        src={slide.image || "/placeholder.svg"}
                                        alt={slide.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 65vw"
                                        priority={index === 0}
                                        className="object-cover"
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />


                                    {/* Content — only show overlay + text if there's text */}
                                    {(slide.title || slide.subtitle || slide.cta) && (
                                    <>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"/>
                                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
                                        <div className="max-w-md">
                                            {slide.title && (
                                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1.5 leading-tight">
                                                {slide.title}
                                            </h2>
                                            )}
                                            {slide.subtitle && (
                                                <p className="text-sm sm:text-base text-white/80 mb-3 line-clamp-2">
                                                    {slide.subtitle}
                                                </p>
                                            )}
                                            {slide.cta && slide.ctaLink && (
                                            <Button
                                                asChild
                                                className="bg-tech-accent hover:bg-tech-accent/90 text-white rounded-md px-5 py-2 text-sm font-semibold shadow-lg"
                                            >
                                                <Link href={slide.ctaLink}>
                                                    {slide.cta}
                                                </Link>
                                            </Button>
                                            )}
                                        </div>
                                    </div>
                                    </>
                                    )}
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            {carouselSlides.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={prevSlide}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="h-5 w-5"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={nextSlide}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="h-5 w-5"/>
                                    </Button>
                                </>
                            )}

                            {/* Dot Indicators */}
                            {carouselSlides.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {carouselSlides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`transition-all duration-300 rounded-full ${
                                                index === current
                                                    ? "bg-tech-accent w-7 h-2"
                                                    : "bg-white/50 hover:bg-white/70 w-2 h-2"
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                            aria-current={index === current ? "true" : "false"}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Banners — right side, desktop only */}
                    {sideBanners.length > 0 && (
                        <div className="hidden lg:flex flex-col gap-3 lg:gap-4 w-[35%]">
                            {sideBanners.map((banner) => {
                                const hasContent = banner.title || banner.subtitle || banner.cta;
                                const content = (
                                    <>
                                        <Image
                                            src={banner.image || "/placeholder.svg"}
                                            alt={banner.title || "Banner"}
                                            fill
                                            sizes="35vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {hasContent && (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
                                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                                    {banner.title && (
                                                        <h3 className="text-base font-bold text-white leading-tight mb-1">{banner.title}</h3>
                                                    )}
                                                    {banner.subtitle && (
                                                        <p className="text-xs text-white/80 line-clamp-1">{banner.subtitle}</p>
                                                    )}
                                                    {banner.cta && (
                                                        <span className="inline-flex items-center mt-2 text-xs font-semibold text-tech-accent group-hover:underline">{banner.cta} →</span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                                return banner.ctaLink ? (
                                    <Link key={banner.id} href={banner.ctaLink} className="relative block flex-1 overflow-hidden rounded-lg group">{content}</Link>
                                ) : (
                                    <div key={banner.id} className="relative block flex-1 overflow-hidden rounded-lg group">{content}</div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
