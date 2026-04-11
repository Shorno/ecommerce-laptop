"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronRight, MoreHorizontal, Pencil, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { CategoryWithSubcategories } from "./category-columns"
import EditCategoryDialog from "./edit-category-dialog"
import DeleteCategoryDialog from "./delete-category-dialog"
import SubcategoryExpandedRow from "../subcategory/subcategory-expanded-row"
import NewSubcategoryDialog from "../subcategory/new-subcategory-dialog"

interface CategoryCardProps {
    category: CategoryWithSubcategories
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const hasSubcategories = category.subCategory.length > 0

    return (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="rounded-lg border bg-card">
                {/* Main Row */}
                <div className="flex items-center gap-3 p-3">
                    {/* Expand Button */}
                    {hasSubcategories ? (
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    ) : (
                        <div className="w-8" />
                    )}

                    {/* Image */}
                    <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted">
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Name & Status */}
                    <div className="flex-1 min-w-0">
                        <span className="font-medium truncate block">{category.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant={category.isActive ? "default" : "secondary"} className="text-[10px] h-5">
                                {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {category.subCategory.length} subcategories
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <EditCategoryDialog category={category} />
                            <DropdownMenuSeparator />
                            <DeleteCategoryDialog category={category} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Expanded Subcategories */}
                <CollapsibleContent>
                    <div className="px-3 pb-3 pt-0">
                        <div className="pt-3 border-t">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">
                                    {category.subCategory.length} items
                                </span>
                                <NewSubcategoryDialog
                                    categoryId={category.id}
                                    categoryName={category.name}
                                />
                            </div>
                            <SubcategoryExpandedRow category={category} />
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}
