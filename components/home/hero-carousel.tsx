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

    // Use all carousel and side images as slides in the full-width carousel
    const carouselSlides = featuredImages.filter(f => f.placement === "carousel" || f.placement === "side")

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
        <section>
            <div className="custom-container pt-3 pb-4">
                {/* Full-width Carousel */}
                <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[480px]">
                        {carouselSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                    index === current
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-[1.02]"
                                }`}
                                role="group"
                                aria-label={`Slide ${index + 1} of ${carouselSlides.length}`}
                            >
                                <Image
                                    src={slide.image || "/placeholder.svg"}
                                    alt={slide.title}
                                    fill
                                    sizes="100vw"
                                    priority={index === 0}
                                    className="object-cover"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />

                                {/* Content overlay */}
                                {(slide.title || slide.subtitle || slide.cta) && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"/>
                                        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-16">
                                            <div className="max-w-lg">
                                                {slide.title && (
                                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 leading-tight tracking-tight">
                                                        {slide.title}
                                                    </h2>
                                                )}
                                                {slide.subtitle && (
                                                    <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-5 max-w-md leading-relaxed">
                                                        {slide.subtitle}
                                                    </p>
                                                )}
                                                {slide.cta && slide.ctaLink && (
                                                    <Button
                                                        asChild
                                                        size="lg"
                                                        className="bg-tech-accent hover:bg-tech-accent/90 text-white rounded-lg px-7 py-3 text-sm font-semibold shadow-xl shadow-tech-accent/20 transition-all hover:shadow-tech-accent/30 hover:translate-y-[-1px]"
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
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/10 transition-all"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="h-5 w-5"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/10 transition-all"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="h-5 w-5"/>
                                </Button>
                            </>
                        )}

                        {/* Dot Indicators */}
                        {carouselSlides.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {carouselSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`transition-all duration-300 rounded-full ${
                                            index === current
                                                ? "bg-white w-8 h-2.5"
                                                : "bg-white/40 hover:bg-white/60 w-2.5 h-2.5"
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                        aria-current={index === current ? "true" : "false"}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
