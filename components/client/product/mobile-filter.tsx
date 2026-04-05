"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, Filter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category, SubCategory } from "@/db/schema"

interface MobileFilterProps {
    categories: Category[]
    subCategories: SubCategory[]
    currentCategorySlug?: string
}

export function MobileFilter({ categories, subCategories, currentCategorySlug }: MobileFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

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
        if (currentCategorySlug) {
            router.push(`/products?category=${categorySlug}`)
        } else {
            updateFilter("category", categorySlug)
        }
        setOpen(false)
    }

    const handleSubCategoryChange = (checked: boolean, subCategorySlug: string) => {
        if (checked) {
            updateFilter("subcategory", subCategorySlug)
        } else {
            updateFilter("subcategory", null)
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
        setOpen(false)
    }

    const hasActiveFilters =
        searchParams.get("category") ||
        searchParams.get("subcategory") ||
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice") ||
        searchParams.get("inStock")

    const activeFilterCount = [
        searchParams.get("category"),
        searchParams.get("subcategory"),
        searchParams.get("minPrice"),
        searchParams.get("maxPrice"),
        searchParams.get("inStock")
    ].filter(Boolean).length

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative gap-2">
                    <Filter size={16} />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[400px] p-0">
                <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <Filter size={18} />
                            Filters
                        </SheetTitle>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="h-8 text-xs"
                            >
                                <X size={14} className="mr-1" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-80px)]">
                    <div className="px-6 py-4 space-y-6">
                        {/* Categories */}
                        {!currentCategorySlug && categories.length > 0 && (
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Category</Label>
                                <RadioGroup
                                    value={searchParams.get("category") || ""}
                                    onValueChange={handleCategoryChange}
                                >
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={category.slug} id={`mobile-${category.slug}`} />
                                            <Label
                                                htmlFor={`mobile-${category.slug}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {category.name}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}

                        {/* Sub Categories */}
                        {subCategories.length > 0 && (
                            <>
                                {!currentCategorySlug && categories.length > 0 && <Separator />}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold">Sub Category</Label>
                                    <div className="space-y-2">
                                        {subCategories.map((subCategory) => (
                                            <div key={subCategory.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`mobile-${subCategory.slug}`}
                                                    checked={searchParams.get("subcategory") === subCategory.slug}
                                                    onCheckedChange={(checked) =>
                                                        handleSubCategoryChange(checked as boolean, subCategory.slug)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`mobile-${subCategory.slug}`}
                                                    className="text-sm font-normal cursor-pointer"
                                                >
                                                    {subCategory.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Price Range */}
                        <Separator />
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold">Price Range</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="mobile-minPrice" className="text-xs text-neutral-600">
                                        Min Price (৳)
                                    </Label>
                                    <Input
                                        id="mobile-minPrice"
                                        type="number"
                                        placeholder="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile-maxPrice" className="text-xs text-neutral-600">
                                        Max Price (৳)
                                    </Label>
                                    <Input
                                        id="mobile-maxPrice"
                                        type="number"
                                        placeholder="10000"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <Button
                                    onClick={handlePriceFilter}
                                    className="w-full"
                                    size="sm"
                                >
                                    Apply Price
                                </Button>
                            </div>
                        </div>

                        {/* Stock Status */}
                        <Separator />
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold">Availability</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="mobile-inStock"
                                    checked={searchParams.get("inStock") === "true"}
                                    onCheckedChange={handleStockFilter}
                                />
                                <Label
                                    htmlFor="mobile-inStock"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    In Stock Only
                                </Label>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

