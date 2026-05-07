"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, SlidersHorizontal } from "lucide-react"
import type { Category, SubCategory } from "@/db/schema"

interface FilterClientProps {
    categories: Category[]
    subCategories: SubCategory[]
    currentCategorySlug?: string
}

export function FilterClient({ categories, subCategories, currentCategorySlug }: FilterClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

    // Derive active subcategory from pathname (e.g. /laptops/gaming-laptop → "gaming-laptop")
    const pathSegments = pathname.split("/").filter(Boolean)
    const currentSubcategorySlug = currentCategorySlug && pathSegments.length >= 2 ? pathSegments[1] : null

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    const handleCategoryChange = (categorySlug: string) => {
        router.push(`/${categorySlug}`)
    }

    const handleSubCategoryChange = (checked: boolean, subCategorySlug: string) => {
        if (checked && currentCategorySlug) {
            router.push(`/${currentCategorySlug}/${subCategorySlug}`)
        } else if (currentCategorySlug) {
            router.push(`/${currentCategorySlug}`)
        }
    }

    const handlePriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (minPrice) {
            params.set("minPrice", minPrice)
        } else {
            params.delete("minPrice")
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice)
        } else {
            params.delete("maxPrice")
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    const handleStockFilter = (checked: boolean) => {
        updateFilter("inStock", checked ? "true" : null)
    }

    const clearAllFilters = () => {
        const params = new URLSearchParams()
        const sort = searchParams.get("sort")
        if (sort) {
            params.set("sort", sort)
        }
        router.push(`${pathname}?${params.toString()}`)
        setMinPrice("")
        setMaxPrice("")
    }

    const hasActiveFilters =
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice") ||
        searchParams.get("inStock")

    return (
        <div className="sticky top-20 hidden lg:block">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SlidersHorizontal size={15}/>
                    Filters
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        <X size={12}/>
                        Clear
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Price Range */}
                <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Price Range
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="minPrice"
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="h-9 text-sm bg-background"
                        />
                        <span className="text-muted-foreground text-xs">–</span>
                        <Input
                            id="maxPrice"
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="h-9 text-sm bg-background"
                        />
                    </div>
                    <Button
                        onClick={handlePriceFilter}
                        variant="outline"
                        className="w-full h-8 text-xs font-medium"
                        size="sm"
                    >
                        Apply
                    </Button>
                </div>

                {/* Divider */}
                <div className="h-px bg-border"/>

                {/* Availability */}
                <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Availability
                    </Label>
                    <div className="flex items-center space-x-2.5">
                        <Checkbox
                            id="inStock"
                            checked={searchParams.get("inStock") === "true"}
                            onCheckedChange={handleStockFilter}
                        />
                        <Label
                            htmlFor="inStock"
                            className="text-sm font-normal cursor-pointer text-foreground"
                        >
                            In Stock Only
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    )
}
