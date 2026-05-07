"use server"

import {db} from "@/db/config"
import {flashSale, flashSaleItem} from "@/db/schema"
import {eq, desc} from "drizzle-orm"
import {revalidatePath} from "next/cache"

// ─── Admin CRUD ───

/**
 * Get all flash sales for admin listing with product details.
 */
export async function getFlashSales() {
    return db.query.flashSale.findMany({
        with: {
            items: {
                with: {
                    product: {
                        columns: {id: true, name: true, slug: true, image: true, minPrice: true},
                    },
                },
            },
        },
        orderBy: [desc(flashSale.createdAt)],
    })
}

/**
 * Get a single flash sale with its items + product details.
 */
export async function getFlashSaleById(id: number) {
    return db.query.flashSale.findFirst({
        where: eq(flashSale.id, id),
        with: {
            items: {
                with: {
                    product: {
                        columns: {id: true, name: true, slug: true, image: true, minPrice: true},
                    },
                },
            },
        },
    })
}

/**
 * Create a new flash sale.
 */
export async function createFlashSale(data: {
    title: string
    startDate: string
    endDate: string
}) {
    try {
        const [sale] = await db.insert(flashSale).values({
            title: data.title,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            isActive: true,
        }).returning()

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true, data: sale}
    } catch (error) {
        console.error("Error creating flash sale:", error)
        return {success: false, error: "Failed to create flash sale"}
    }
}

/**
 * Update a flash sale.
 */
export async function updateFlashSale(id: number, data: {
    title?: string
    startDate?: string
    endDate?: string
    isActive?: boolean
}) {
    try {
        const updateData: Record<string, unknown> = {updatedAt: new Date()}
        if (data.title !== undefined) updateData.title = data.title
        if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
        if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate)
        if (data.isActive !== undefined) updateData.isActive = data.isActive

        await db.update(flashSale).set(updateData).where(eq(flashSale.id, id))

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true}
    } catch (error) {
        console.error("Error updating flash sale:", error)
        return {success: false, error: "Failed to update flash sale"}
    }
}

/**
 * Delete a flash sale.
 */
export async function deleteFlashSale(id: number) {
    try {
        await db.delete(flashSale).where(eq(flashSale.id, id))

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true}
    } catch (error) {
        console.error("Error deleting flash sale:", error)
        return {success: false, error: "Failed to delete flash sale"}
    }
}

/**
 * Add a product to a flash sale.
 */
export async function addProductToFlashSale(data: {
    flashSaleId: number
    productId: number
    discountType: "percentage" | "fixed"
    discountValue: string
}) {
    try {
        await db.insert(flashSaleItem).values({
            flashSaleId: data.flashSaleId,
            productId: data.productId,
            discountType: data.discountType,
            discountValue: data.discountValue,
        })

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true}
    } catch (error) {
        console.error("Error adding product to flash sale:", error)
        return {success: false, error: "Failed to add product"}
    }
}

/**
 * Update a flash sale item's discount.
 */
export async function updateFlashSaleItem(itemId: number, data: {
    discountType: "percentage" | "fixed"
    discountValue: string
}) {
    try {
        await db.update(flashSaleItem).set({
            discountType: data.discountType,
            discountValue: data.discountValue,
            updatedAt: new Date(),
        }).where(eq(flashSaleItem.id, itemId))

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true}
    } catch (error) {
        console.error("Error updating flash sale item:", error)
        return {success: false, error: "Failed to update item"}
    }
}

/**
 * Remove a product from a flash sale.
 */
export async function removeProductFromFlashSale(itemId: number) {
    try {
        await db.delete(flashSaleItem).where(eq(flashSaleItem.id, itemId))

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true}
    } catch (error) {
        console.error("Error removing product from flash sale:", error)
        return {success: false, error: "Failed to remove product"}
    }
}

/**
 * Get all products for the flash sale picker.
 */
export async function getAllProductsForFlashSale() {
    const {product} = await import("@/db/schema")
    const {desc} = await import("drizzle-orm")

    return db.query.product.findMany({
        columns: {id: true, name: true, slug: true, image: true, minPrice: true},
        orderBy: [desc(product.createdAt)],
    })
}

/**
 * Bulk add products to a flash sale.
 */
export async function addProductsToFlashSale(data: {
    flashSaleId: number
    items: { productId: number; discountType: "percentage" | "fixed"; discountValue: string }[]
}) {
    try {
        if (data.items.length === 0) return {success: false, error: "No products selected"}

        await db.insert(flashSaleItem).values(
            data.items.map(item => ({
                flashSaleId: data.flashSaleId,
                productId: item.productId,
                discountType: item.discountType,
                discountValue: item.discountValue,
            }))
        )

        revalidatePath("/admin/dashboard/flash-sales")
        revalidatePath("/")

        return {success: true}
    } catch (error) {
        console.error("Error adding products to flash sale:", error)
        return {success: false, error: "Failed to add products"}
    }
}
