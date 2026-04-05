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
        if (!isAutoPlay || featuredImages.length === 0) return

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % featuredImages.length)
        }, 5000)

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

    if (featuredImages.length === 0) return null

    return (
        <div className="relative w-full bg-tech-navy overflow-hidden">
            <div className="container mx-auto">
                <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px]">
                    {featuredImages.map((slide, index) => (
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
                            aria-label={`Slide ${index + 1} of ${featuredImages.length}`}
                        >
                            {/* Background Image */}
                            <Image
                                src={slide.image || "/placeholder.svg"}
                                alt={slide.title}
                                fill
                                sizes="100vw"
                                priority={index === 0}
                                className="object-cover rounded-lg"
                                loading={index === 0 ? "eager" : "lazy"}
                            />

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-lg" />

                            {/* Content — bottom left */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12">
                                <div className="max-w-lg">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                                        {slide.title}
                                    </h2>
                                    {slide.subtitle && (
                                        <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-4 line-clamp-2">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    <Button
                                        asChild
                                        className="bg-tech-accent hover:bg-tech-accent/90 text-white rounded-md px-6 py-2.5 text-sm font-semibold shadow-lg"
                                    >
                                        <Link href={slide.ctaLink}>
                                            {slide.cta}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Buttons */}
                    {featuredImages.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevSlide}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextSlide}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}

                    {/* Dot Indicators */}
                    {featuredImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {featuredImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === current
                                            ? "bg-tech-accent w-8 h-2.5"
                                            : "bg-white/50 hover:bg-white/70 w-2.5 h-2.5"
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
    )
}
