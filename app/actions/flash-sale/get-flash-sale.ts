"use server"

import {db} from "@/db/config"
import {flashSale, flashSaleItem} from "@/db/schema"
import {product, productVariant} from "@/db/schema"
import {eq, and, lte, gt, desc, inArray, sql} from "drizzle-orm"

// ─── Client Queries ───

/**
 * Get the currently active flash sale with its products.
 * Returns null if no active sale is running right now.
 */
export async function getActiveFlashSale() {
    const now = new Date()

    const sale = await db.query.flashSale.findFirst({
        where: and(
            eq(flashSale.isActive, true),
            lte(flashSale.startDate, now),
            gt(flashSale.endDate, now),
        ),
        with: {
            items: true,
        },
        orderBy: [desc(flashSale.createdAt)],
    })

    if (!sale || sale.items.length === 0) return null

    // Fetch associated products with their variants
    const productIds = sale.items.map(i => i.productId)

    const products = await db.query.product.findMany({
        where: inArray(product.id, productIds),
        with: {
            category: {columns: {name: true, slug: true}},
            variants: true,
        },
    })

    // Build response with discount info
    const saleProducts = sale.items.map(item => {
        const prod = products.find(p => p.id === item.productId)
        if (!prod) return null

        const minVariantPrice = prod.variants.length > 0
            ? Math.min(...prod.variants.map(v => parseFloat(v.price)))
            : prod.minPrice ? parseFloat(prod.minPrice) : 0

        const salePrice = item.discountType === "percentage"
            ? minVariantPrice * (1 - parseFloat(item.discountValue) / 100)
            : minVariantPrice - parseFloat(item.discountValue)

        return {
            product: {
                id: prod.id,
                name: prod.name,
                slug: prod.slug,
                image: prod.image,
                isFeatured: prod.isFeatured,
                minPrice: prod.minPrice,
                category: prod.category,
                variants: prod.variants.map(v => ({
                    id: v.id,
                    price: v.price,
                    stock: v.stock,
                    inStock: v.inStock,
                })),
            },
            discountType: item.discountType,
            discountValue: item.discountValue,
            originalPrice: minVariantPrice,
            salePrice: Math.max(0, Math.round(salePrice)),
        }
    }).filter(Boolean)

    return {
        id: sale.id,
        title: sale.title,
        startDate: sale.startDate,
        endDate: sale.endDate,
        products: saleProducts,
    }
}

/**
 * Check if specific products are in an active flash sale.
 * Returns a map of productId -> discount info.
 */
export async function getFlashSaleForProducts(productIds: number[]): Promise<Map<number, {
    discountType: string
    discountValue: string
    saleEndDate: Date
    saleTitle: string
}>> {
    const result = new Map<number, {
        discountType: string
        discountValue: string
        saleEndDate: Date
        saleTitle: string
    }>()

    if (productIds.length === 0) return result

    const now = new Date()

    const activeSales = await db
        .select({
            productId: flashSaleItem.productId,
            discountType: flashSaleItem.discountType,
            discountValue: flashSaleItem.discountValue,
            saleEndDate: flashSale.endDate,
            saleTitle: flashSale.title,
        })
        .from(flashSaleItem)
        .innerJoin(flashSale, eq(flashSaleItem.flashSaleId, flashSale.id))
        .where(and(
            inArray(flashSaleItem.productId, productIds),
            eq(flashSale.isActive, true),
            lte(flashSale.startDate, now),
            gt(flashSale.endDate, now),
        ))

    for (const row of activeSales) {
        result.set(row.productId, {
            discountType: row.discountType,
            discountValue: row.discountValue,
            saleEndDate: row.saleEndDate,
            saleTitle: row.saleTitle,
        })
    }

    return result
}

/**
 * Check if a single product is in an active flash sale.
 */
export async function getFlashSaleForProduct(productId: number) {
    const now = new Date()

    const row = await db
        .select({
            discountType: flashSaleItem.discountType,
            discountValue: flashSaleItem.discountValue,
            saleEndDate: flashSale.endDate,
            saleTitle: flashSale.title,
        })
        .from(flashSaleItem)
        .innerJoin(flashSale, eq(flashSaleItem.flashSaleId, flashSale.id))
        .where(and(
            eq(flashSaleItem.productId, productId),
            eq(flashSale.isActive, true),
            lte(flashSale.startDate, now),
            gt(flashSale.endDate, now),
        ))
        .limit(1)

    return row[0] || null
}
