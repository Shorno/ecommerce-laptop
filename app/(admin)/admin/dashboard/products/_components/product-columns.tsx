"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, MoreHorizontal} from "lucide-react"
import Image from "next/image"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {Product, ProductImage} from "@/db/schema/product"
import {Category, SubCategory} from "@/db/schema/category"
import EditProductDialog from "./edit-product-dialog"
import DeleteProductDialog from "./delete-product-dialog"
import { useTranslations } from "next-intl"

export interface ProductWithRelations extends Product {
    images: ProductImage[]
    category: Category
    subCategory: SubCategory | null
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
            accessorKey: "size",
            header: () => <div className="text-center">{t('size')}</div>,
            cell: ({row}) => (
                <div className="text-center">{row.getValue("size")}</div>
            ),
        },
        {
            accessorKey: "price",
            header: ({column}) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('price')}
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => {
                const price = parseFloat(row.getValue("price"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price)
                return <div className="text-center font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "stockQuantity",
            header: ({column}) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {t('stock')}
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => (
                <div className="text-center">{row.getValue("stockQuantity")}</div>
            ),
        },
        {
            accessorKey: "inStock",
            header: () => <div className="text-center">{t('status')}</div>,
            cell: ({row}) => {
                const inStock = row.getValue("inStock") as boolean
                return (
                    <div className="flex justify-center">
                        <Badge variant={inStock ? "default" : "secondary"}>
                            {inStock ? t('active') : t('inactive')}
                        </Badge>
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
                                <EditProductDialog product={product}/>
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
