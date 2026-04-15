"use server"

import {db} from "@/db/config"
import {product, productVariant} from "@/db/schema/product"
import {category} from "@/db/schema/category"
import {brand} from "@/db/schema/brand"
import {eq} from "drizzle-orm"
import {revalidatePath} from "next/cache"
import {checkAuth} from "@/app/actions/auth/checkAuth"

export interface InventoryItem {
    variantId: number
    sku: string | null
    stock: number
    inStock: boolean
    price: string
    optionValues: string | null
    productId: number
    productName: string
    productImage: string
    productSlug: string
    categoryName: string
    brandName: string | null
}

export async function getInventory(): Promise<InventoryItem[]> {
    try {
        const rows = await db
            .select({
                variantId: productVariant.id,
                sku: productVariant.sku,
                stock: productVariant.stock,
                inStock: productVariant.inStock,
                price: productVariant.price,
                optionValues: productVariant.optionValues,
                productId: product.id,
                productName: product.name,
                productImage: product.image,
                productSlug: product.slug,
                categoryName: category.name,
                brandName: brand.name,
            })
            .from(productVariant)
            .innerJoin(product, eq(productVariant.productId, product.id))
            .innerJoin(category, eq(product.categoryId, category.id))
            .leftJoin(brand, eq(product.brandId, brand.id))
            .orderBy(product.name, productVariant.sortOrder)

        return rows
    } catch (error) {
        console.error("Error fetching inventory:", error)
        return []
    }
}

export async function updateVariantStock(
    variantId: number,
    newStock: number,
    newInStock: boolean
): Promise<{ success: boolean; error?: string }> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {success: false, error: "Unauthorized"}
    }

    try {
        await db
            .update(productVariant)
            .set({stock: newStock, inStock: newInStock})
            .where(eq(productVariant.id, variantId))

        revalidatePath("/admin/dashboard/inventory")
        revalidatePath("/admin/dashboard/products")
        return {success: true}
    } catch (error) {
        console.error("Error updating stock:", error)
        return {success: false, error: "Failed to update stock"}
    }
}
