"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, Filter } from "lucide-react"
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
            // If on category page, navigate to products page with category filter
            router.push(`/products?category=${categorySlug}`)
        } else {
            updateFilter("category", categorySlug)
        }
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
    }

    const hasActiveFilters =
        searchParams.get("category") ||
        searchParams.get("subcategory") ||
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice") ||
        searchParams.get("inStock")

    return (
        <Card className="sticky top-4 hidden lg:block">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter size={18} />
                        Filters
                    </CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-6">
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
                                    <RadioGroupItem value={category.slug} id={category.slug} />
                                    <Label
                                        htmlFor={category.slug}
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
                        <Separator />
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold">Sub Category</Label>
                            <div className="space-y-2">
                                {subCategories.map((subCategory) => (
                                    <div key={subCategory.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={subCategory.slug}
                                            checked={searchParams.get("subcategory") === subCategory.slug}
                                            onCheckedChange={(checked) =>
                                                handleSubCategoryChange(checked as boolean, subCategory.slug)
                                            }
                                        />
                                        <Label
                                            htmlFor={subCategory.slug}
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
                            <Label htmlFor="minPrice" className="text-xs text-neutral-600">
                                Min Price (৳)
                            </Label>
                            <Input
                                id="minPrice"
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="h-9"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxPrice" className="text-xs text-neutral-600">
                                Max Price (৳)
                            </Label>
                            <Input
                                id="maxPrice"
                                type="number"
                                placeholder="10000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="h-9"
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
                            id="inStock"
                            checked={searchParams.get("inStock") === "true"}
                            onCheckedChange={handleStockFilter}
                        />
                        <Label
                            htmlFor="inStock"
                            className="text-sm font-normal cursor-pointer"
                        >
                            In Stock Only
                        </Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
