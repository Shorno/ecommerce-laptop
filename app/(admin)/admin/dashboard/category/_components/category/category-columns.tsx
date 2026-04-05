"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, ChevronDown, ChevronRight, ExternalLink, MoreHorizontal, Plus} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {Category, SubCategory} from "@/db/schema/category"
import NewSubcategoryDialog from "../subcategory/new-subcategory-dialog"
import EditCategoryDialog from "@/app/(admin)/admin/dashboard/category/_components/category/edit-category-dialog";
import DeleteCategoryDialog from "@/app/(admin)/admin/dashboard/category/_components/category/delete-category-dialog";

export interface CategoryWithSubcategories extends Category {
    subCategory: SubCategory[]
}

export function useCategoryColumns() {
    const columns: ColumnDef<CategoryWithSubcategories>[] = [
        {
            id: "expand",
            header: () => null,
            cell: ({row}) => {
                const hasSubcategories = row.original.subCategory.length > 0
                return hasSubcategories ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => row.toggleExpanded()}
                    >
                        {row.getIsExpanded() ? (
                            <ChevronDown className="h-4 w-4"/>
                        ) : (
                            <ChevronRight className="h-4 w-4"/>
                        )}
                    </Button>
                ) : (
                    <div className="w-8"/>
                )
            },
            size: 40,
        },
        {
            accessorKey: "image",
            header: "Image",
            cell: ({row}) => (
                <div className="w-12 h-12 relative">
                    <Image
                        src={row.getValue("image")}
                        alt={row.getValue("name")}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            ),
            enableSorting: false,
            size: 60,
        },
        {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => (
                <div className="text-center font-medium max-w-[200px] truncate mx-auto" title={row.getValue("name")}>
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: () => <div className="text-center">Status</div>,
            cell: ({row}) => {
                const isActive = row.getValue("isActive") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                )
            },
            size: 100,
        },
        {
            accessorKey: "displayOrder",
            header: ({column}) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Display Order
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => (
                <div className="text-center">{row.getValue("displayOrder")}</div>
            ),
            size: 150,
        },
        {
            id: "subcategories",
            header: () => <div className="text-center">Subcategories</div>,
            cell: ({row}) => {
                const category = row.original
                const count = category.subCategory.length
                return (
                    <div className="flex justify-center items-center gap-1">
                        <Button asChild size="sm" variant="ghost"
                                className="h-7 px-2 text-muted-foreground hover:text-foreground">
                            <Link href={`/admin/dashboard/category/${category.id}`}>
                                {count} {count === 1 ? 'item' : 'items'}
                                <ExternalLink className="h-3 w-3 ml-1"/>
                            </Link>
                        </Button>
                        <NewSubcategoryDialog
                            categoryId={category.id}
                            categoryName={category.name}
                        />
                    </div>
                )
            },
            size: 180,
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            enableHiding: false,
            cell: ({row}) => {
                const category = row.original

                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <EditCategoryDialog category={category}/>
                                <DropdownMenuSeparator/>
                                <DeleteCategoryDialog
                                    category={category}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    return columns;
}
