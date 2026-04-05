"use client"

import { CategoryWithSubcategories } from "../category/category-columns"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink } from "lucide-react"
import DeleteSubcategoryDialog from "./delete-subcategory-dialog"

interface SubcategoryExpandedRowProps {
    category: CategoryWithSubcategories
}

export default function SubcategoryExpandedRow({ category }: SubcategoryExpandedRowProps) {
    const subcategories = category.subCategory

    if (subcategories.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-4 text-sm">
                No subcategories yet
            </div>
        )
    }

    return (
        <div className="space-y-1">
            {subcategories.map((subcategory) => (
                <div
                    key={subcategory.id}
                    className="flex items-center gap-3 rounded hover:bg-accent/50 transition-colors group"
                >
                    {/* Clickable Row - navigates to subcategory detail */}
                    <Link
                        href={`/admin/dashboard/category/${category.id}`}
                        className="flex items-center gap-3 flex-1 min-w-0 px-2 py-2"
                    >
                        {/* Image */}
                        <div className="relative w-7 h-7 shrink-0 rounded overflow-hidden bg-muted">
                            <Image
                                src={subcategory.image}
                                alt={subcategory.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Name */}
                        <span className="flex-1 text-sm truncate">{subcategory.name}</span>

                        {/* Status */}
                        {!subcategory.isActive && (
                            <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
                                Inactive
                            </Badge>
                        )}

                        {/* Edit indicator on hover */}
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>

                    {/* Delete button - always visible on mobile, hover on desktop */}
                    <div className="pr-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <DeleteSubcategoryDialog
                            subcategory={subcategory}
                            trigger={
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            }
                        />
                    </div>
                </div>
            ))}

            {/* View All link */}
            <div className="pt-2 border-t mt-2">
                <Link
                    href={`/admin/dashboard/category/${category.id}`}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                    View all subcategories
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>
        </div>
    )
}
