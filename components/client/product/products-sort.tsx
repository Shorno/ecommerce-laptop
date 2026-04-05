"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MobileFilter } from "@/components/client/product/mobile-filter"
import type { Category, SubCategory } from "@/db/schema"

interface ProductsSortProps {
    categories?: Category[]
    subCategories?: SubCategory[]
    currentCategorySlug?: string
}

export function ProductsSort({ categories = [], subCategories = [], currentCategorySlug }: ProductsSortProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", value)
        router.push(`${pathname}?${params.toString()}`)
    }

    const currentSort = searchParams.get("sort") || "newest"

    return (
        <div className="flex items-center gap-2 justify-between w-full lg:w-auto">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
                <MobileFilter
                    categories={categories}
                    subCategories={subCategories}
                    currentCategorySlug={currentCategorySlug}
                />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm text-neutral-600 hidden sm:inline">
                    Sort by:
                </Label>
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger id="sort" className="w-[140px] sm:w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
