"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, Eye, MoreHorizontal} from "lucide-react"
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
import { useTranslations } from "next-intl"

export interface CategoryWithSubcategories extends Category {
    subCategory: SubCategory[]
}

export function useCategoryColumns() {
    const t = useTranslations('categories');

    const columns: ColumnDef<CategoryWithSubcategories>[] = [
        {
            accessorKey: "image",
            header: t('image'),
            cell: ({row}) => (
                <div className="w-16 h-16 relative">
                    <Image
                        src={row.getValue("image")}
                        alt={row.getValue("name")}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            ),
            enableSorting: false,
            size: 80,
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
                            {t('name')}
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => (
                <div className="text-center font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "slug",
            header: () => <div className="text-center">{t('slug')}</div>,
            cell: ({row}) => (
                <div className="text-center text-muted-foreground">{row.getValue("slug")}</div>
            ),
        },
        {
            accessorKey: "isActive",
            header: () => <div className="text-center">{t('status')}</div>,
            cell: ({row}) => {
                const isActive = row.getValue("isActive") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? t('active') : t('inactive')}
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
                            {t('displayOrder')}
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
            header: () => <div className="text-center">{t('subcategories')}</div>,
            cell: ({row}) => {
                const category = row.original
                return (
                    <div className="flex justify-center gap-2">
                        {
                            category.subCategory.length > 0 ? (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/dashboard/category/${category.id}`}>
                                        <Eye className="h-4 w-4 mr-1"/>
                                        {t('viewSubcategories')} ({category.subCategory.length})
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" size="sm" className={"text-muted-foreground"}>
                                        N/A
                                </Button>
                            )
                        }
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
            header: () => <div className="text-center">{t('actions')}</div>,
            enableHiding: false,
            cell: ({row}) => {
                const category = row.original

                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t('openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <EditCategoryDialog category={category} />
                                <DropdownMenuSeparator />
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
