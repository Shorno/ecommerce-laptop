"use client"

import {useState, useEffect, useRef} from "react"
import Link from "next/link"
import Image from "next/image"
import {ChevronLeft, ChevronRight, Clock, Flame} from "lucide-react"
import {formatPrice} from "@/utils/currency"

interface FlashSaleProduct {
    product: {
        id: number
        name: string
        slug: string
        image: string
        isFeatured: boolean
        minPrice: string | null
        category: { name: string; slug: string }
        variants: { id: number; price: string; stock: number; inStock: boolean }[]
    }
    discountType: string
    discountValue: string
    originalPrice: number
    salePrice: number
}

interface FlashSaleData {
    id: number
    title: string
    startDate: Date
    endDate: Date
    products: FlashSaleProduct[]
}

function useCountdown(endDate: Date) {
    const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0, expired: false})

    useEffect(() => {
        const tick = () => {
            const diff = new Date(endDate).getTime() - Date.now()
            if (diff <= 0) {
                setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0, expired: true})
                return
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
                expired: false,
            })
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [endDate])

    return timeLeft
}

export default function FlashSaleClient({sale}: { sale: FlashSaleData }) {
    const {days, hours, minutes, seconds, expired} = useCountdown(sale.endDate)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    if (expired) return null

    const checkScroll = () => {
        if (!scrollRef.current) return
        const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current
        setCanScrollLeft(scrollLeft > 4)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
    }

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({left: dir === "left" ? -300 : 300, behavior: "smooth"})
        setTimeout(checkScroll, 350)
    }

    const pad = (n: number) => n.toString().padStart(2, "0")

    return (
        <section className="py-6 md:py-10">
            <div className="custom-container">
                {/* Section Header — matches site pattern */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-7 bg-red-500 rounded-full"/>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                    {sale.title}
                                </h2>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                    <Flame className="h-3 w-3"/>Live
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground ml-4 pl-px">
                            Limited time offers on selected laptops
                        </p>
                    </div>

                    {/* Countdown — clean inline style */}
                    <div className="flex items-center gap-2 ml-4 sm:ml-0">
                        <Clock className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-xs text-muted-foreground font-medium">Ends in</span>
                        <div className="flex items-center gap-1 font-mono">
                            {days > 0 && (
                                <>
                                    <TimeBlock value={pad(days)} label="d"/>
                                    <span className="text-muted-foreground/40 text-sm font-bold">:</span>
                                </>
                            )}
                            <TimeBlock value={pad(hours)} label="h"/>
                            <span className="text-muted-foreground/40 text-sm font-bold">:</span>
                            <TimeBlock value={pad(minutes)} label="m"/>
                            <span className="text-muted-foreground/40 text-sm font-bold">:</span>
                            <TimeBlock value={pad(seconds)} label="s"/>
                        </div>
                    </div>
                </div>

                {/* Product Carousel */}
                <div className="relative group/carousel">
                    {/* Scroll Arrows */}
                    {canScrollLeft && (
                        <button
                            type="button"
                            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200/80 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105 focus:outline-none"
                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600"/>
                        </button>
                    )}
                    {canScrollRight && (
                        <button
                            type="button"
                            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200/80 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105 focus:outline-none"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600"/>
                        </button>
                    )}

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-1"
                        style={{scrollSnapType: "x mandatory"}}
                        onScroll={checkScroll}
                    >
                        {sale.products.map((item) => {
                            if (!item) return null
                            const discountPercent = item.originalPrice > 0
                                ? Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)
                                : 0

                            return (
                                <Link
                                    key={item.product.id}
                                    href={`/product/${item.product.slug}`}
                                    className="flex-shrink-0 w-[200px] sm:w-[220px] group/card"
                                    style={{scrollSnapAlign: "start"}}
                                >
                                    <div className="h-full flex flex-col rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/8 transition-all duration-300 hover:-translate-y-0.5">
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-contain p-4 group-hover/card:scale-105 transition-transform duration-500 ease-out"
                                                sizes="220px"
                                            />
                                            {/* Discount Badge */}
                                            {discountPercent > 0 && (
                                                <div className="absolute top-2.5 left-2.5">
                                                    <span className="inline-block text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-md shadow-sm">
                                                        -{discountPercent}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-grow p-3.5">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                {item.product.category.name}
                                            </p>
                                            <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug mb-auto group-hover/card:text-tech-accent transition-colors">
                                                {item.product.name}
                                            </h3>

                                            {/* Price */}
                                            <div className="pt-3 mt-2 border-t border-gray-100">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-base font-bold text-gray-900">
                                                        {formatPrice(item.salePrice.toString())}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 line-through">
                                                        {formatPrice(item.originalPrice.toString())}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                                        Save {formatPrice((item.originalPrice - item.salePrice).toString())}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

/* Countdown time block */
function TimeBlock({value, label}: { value: string; label: string }) {
    return (
        <span className="inline-flex items-baseline gap-px text-sm font-semibold text-foreground bg-gray-100 rounded-md px-2 py-1 tabular-nums">
            {value}
            <span className="text-[9px] text-muted-foreground font-medium ml-0.5">{label}</span>
        </span>
    )
}
