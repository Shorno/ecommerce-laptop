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
        <div className="hidden lg:block border-b bg-card">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex items-center gap-5 overflow-x-auto py-2.5">
                    {allSubcategories.map((sub) => {
                        const isActive = activeSubcategorySlug === sub.slug
                        return (
                            <Link
                                key={sub.id}
                                href={`/${sub.categorySlug}/${sub.slug}`}
                                className={`text-sm whitespace-nowrap transition-colors font-medium ${
                                    isActive
                                        ? "text-tech-accent"
                                        : "text-foreground/70 hover:text-tech-accent"
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
