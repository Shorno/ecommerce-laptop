"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SubCategory } from "@/db/schema/category"

interface Category {
    name: string
    slug: string
    image: string
    subCategory: SubCategory[]
}

interface CategoryNavProps {
    categories: Category[]
}

export default function CategoryNav({ categories }: CategoryNavProps) {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)
    const activeSubcategorySlug = pathSegments[1] || null

    // Flatten all subcategories from all categories
    const allSubcategories = categories.flatMap((cat) =>
        cat.subCategory.map((sub) => ({
            ...sub,
            categorySlug: cat.slug,
        }))
    )

    if (allSubcategories.length === 0) return null

    return (
        <div className="hidden lg:block border-b border-border/60 bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto max-w-[1400px] px-4 md:px-6">
                <div className="flex items-center gap-6 overflow-x-auto py-2.5 scrollbar-none">
                    {allSubcategories.map((sub) => {
                        const isActive = activeSubcategorySlug === sub.slug
                        return (
                            <Link
                                key={sub.id}
                                href={`/${sub.categorySlug}/${sub.slug}`}
                                className={`text-[13px] whitespace-nowrap transition-colors font-medium ${
                                    isActive
                                        ? "text-tech-accent"
                                        : "text-foreground/60 hover:text-foreground"
                                }`}
                            >
                                {sub.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
