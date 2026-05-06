"use server"

import {db} from "@/db/config"
import {review} from "@/db/schema/review"
import {eq, and, sql, inArray} from "drizzle-orm"

/**
 * Get approved review stats for multiple products at once (for product listings).
 * Returns a map of productId -> { averageRating, totalReviews }
 */
export async function getProductReviewStats(productIds: number[]): Promise<
    Record<number, { averageRating: number; totalReviews: number }>
> {
    if (productIds.length === 0) return {}

    try {
        const stats = await db
            .select({
                productId: review.productId,
                averageRating: sql<number>`round(avg(${review.rating})::numeric, 1)::float`,
                totalReviews: sql<number>`count(${review.id})::int`,
            })
            .from(review)
            .where(
                and(
                    eq(review.isApproved, true),
                    inArray(review.productId, productIds)
                )
            )
            .groupBy(review.productId)

        const result: Record<number, { averageRating: number; totalReviews: number }> = {}
        for (const s of stats) {
            result[s.productId] = {
                averageRating: s.averageRating,
                totalReviews: s.totalReviews,
            }
        }
        return result
    } catch (error) {
        console.error("Error fetching review stats:", error)
        return {}
    }
}

/**
 * Get approved review stats for a single product (for product detail page).
 */
export async function getSingleProductReviewStats(productId: number): Promise<{
    averageRating: number
    totalReviews: number
}> {
    try {
        const [stats] = await db
            .select({
                averageRating: sql<number>`coalesce(round(avg(${review.rating})::numeric, 1)::float, 0)`,
                totalReviews: sql<number>`count(${review.id})::int`,
            })
            .from(review)
            .where(
                and(
                    eq(review.productId, productId),
                    eq(review.isApproved, true)
                )
            )

        return {
            averageRating: stats?.averageRating ?? 0,
            totalReviews: stats?.totalReviews ?? 0,
        }
    } catch (error) {
        console.error("Error fetching single product review stats:", error)
        return {averageRating: 0, totalReviews: 0}
    }
}
