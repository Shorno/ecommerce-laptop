"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, MoreHorizontal, Pencil} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {Product, ProductImage, ProductOption, ProductVariant} from "@/db/schema/product"
import {Category, SubCategory} from "@/db/schema/category"
import DeleteProductDialog from "./delete-product-dialog"
import { useTranslations } from "next-intl"

export interface ProductWithRelations extends Product {
    images: ProductImage[]
    category: Category
    subCategory: SubCategory | null
    options: ProductOption[]
    variants: ProductVariant[]
}

export function useProductColumns() {
    const t = useTranslations('products');

    const columns: ColumnDef<ProductWithRelations>[] = [
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
                <div className="font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "category",
            header: () => <div className="text-center">{t('category')}</div>,
            cell: ({row}) => {
                const product = row.original
                return (
                    <div className="text-center">
                        <div className="font-medium">{product.category.name}</div>
                        {product.subCategory && (
                            <div className="text-xs text-muted-foreground">
                                {product.subCategory.name}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            id: "price",
            header: () => <div className="text-center">{t('price')}</div>,
            cell: ({row}) => {
                const product = row.original
                const variants = product.variants || []
                if (variants.length === 0) {
                    return <div className="text-center text-muted-foreground">No variants</div>
                }
                const prices = variants.map(v => parseFloat(v.price))
                const minPrice = Math.min(...prices)
                const maxPrice = Math.max(...prices)
                const formatted = (p: number) => new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "BDT",
                }).format(p)

                return (
                    <div className="text-center font-medium">
                        {minPrice === maxPrice
                            ? formatted(minPrice)
                            : `${formatted(minPrice)} - ${formatted(maxPrice)}`
                        }
                    </div>
                )
            },
        },
        {
            id: "variants",
            header: () => <div className="text-center">Variants</div>,
            cell: ({row}) => {
                const variants = row.original.variants || []
                const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
                return (
                    <div className="text-center">
                        <div className="font-medium">{variants.length} variant{variants.length !== 1 ? "s" : ""}</div>
                        <div className="text-xs text-muted-foreground">{totalStock} total stock</div>
                    </div>
                )
            },
        },
        {
            accessorKey: "isFeatured",
            header: () => <div className="text-center">{t('featured')}</div>,
            cell: ({row}) => {
                const isFeatured = row.getValue("isFeatured") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={isFeatured ? "default" : "outline"}>
                            {isFeatured ? t('yes') : t('no')}
                        </Badge>
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">{t('actions')}</div>,
            enableHiding: false,
            cell: ({row}) => {
                const product = row.original

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
                                <Link href={`/admin/dashboard/products/edit/${product.id}`}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <Pencil className="h-4 w-4 mr-2"/>
                                        Edit
                                    </Button>
                                </Link>
                                <DeleteProductDialog
                                    productId={product.id}
                                    productName={product.name}
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
