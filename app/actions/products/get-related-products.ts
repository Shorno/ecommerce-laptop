"use server"

import {db} from "@/db/config"
import {product} from "@/db/schema/product"
import {eq, ne, and, desc} from "drizzle-orm"

/**
 * Get related products — same category, excluding the current product.
 * Returns up to 6 related products with category and variant info.
 */
export async function getRelatedProducts(productId: number, categoryId: number, limit = 6) {
    try {
        const related = await db.query.product.findMany({
            where: and(
                eq(product.categoryId, categoryId),
                ne(product.id, productId)
            ),
            with: {
                category: {
                    columns: {
                        name: true,
                        slug: true
                    }
                },
                variants: {
                    columns: {
                        id: true,
                        price: true,
                        stock: true,
                        inStock: true,
                    }
                }
            },
            orderBy: [desc(product.isFeatured), desc(product.createdAt)],
            limit,
        })

        return related
    } catch (error) {
        console.error("Error fetching related products:", error)
        return []
    }
}
