"use client"
import React, { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeaturedImage } from "@/db/schema"
import Image from "next/image";
import Link from "next/link";

interface HeroCarouselProps {
    featuredImages: FeaturedImage[]
}

export default function HeroCarousel({ featuredImages }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)

    useEffect(() => {
        if (!isAutoPlay) return

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % featuredImages.length)
        }, 6000)

        return () => clearInterval(interval)
    }, [isAutoPlay, featuredImages.length])

    const goToSlide = useCallback((index: number) => {
        setCurrent(index)
        setIsAutoPlay(false)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % featuredImages.length)
        setIsAutoPlay(false)
    }, [featuredImages.length])

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + featuredImages.length) % featuredImages.length)
        setIsAutoPlay(false)
    }, [featuredImages.length])

    return (
        <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-background">
            <div className="relative w-full h-full">
                {featuredImages.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === current ? "opacity-100" : "opacity-0"
                        }`}
                        role="group"
                        aria-label={`Slide ${index + 1} of ${featuredImages.length}`}
                    >
                        {/* Background Image */}
                        <Image
                            src={slide.image || "/placeholder.svg"}
                            alt={slide.title}
                            fill
                            sizes="100vw"
                            priority={index === current}
                            style={{ objectFit: "cover" }}
                            loading={index === current ? "eager" : "lazy"}
                        />


                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-4xl mx-auto">
                                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 text-balance">
                                    {slide.title}
                                </h1>
                                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 text-balance">
                                    {slide.subtitle}
                                </p>
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold"
                                >
                                    <Link href={slide.ctaLink}>
                                        {slide.cta}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 pointer-events-none z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="pointer-events-auto h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    className="pointer-events-auto h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
                {featuredImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === current
                                ? "bg-white w-8 h-2.5 sm:w-10 sm:h-3"
                                : "bg-white/50 hover:bg-white/70 w-2.5 h-2.5 sm:w-3 sm:h-3"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === current ? "true" : "false"}
                    />
                ))}
            </div>

            {/* Auto-play Toggle */}
            <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 text-white/70 hover:text-white text-xs sm:text-sm transition-colors"
                aria-label={isAutoPlay ? "Pause carousel" : "Play carousel"}
            >
                {isAutoPlay ? "⏸" : "▶"}
            </button>
        </div>
    )
}
