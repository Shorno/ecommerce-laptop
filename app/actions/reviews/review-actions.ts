"use server"

import {db} from "@/db/config"
import {review} from "@/db/schema/review"
import {user} from "@/db/schema/auth-schema"
import {product} from "@/db/schema/product"
import {eq, desc, and, sql} from "drizzle-orm"
import {checkAuth} from "@/app/actions/auth/checkAuth"
import {revalidatePath} from "next/cache"

// ── Submit a review (logged-in users only) ──

export async function submitReview(data: {
    productId: number
    rating: number
    title: string
    body: string
}): Promise<{ success: boolean; error?: string }> {
    const session = await checkAuth()

    if (!session?.user) {
        return {success: false, error: "You must be logged in to leave a review."}
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
        return {success: false, error: "Rating must be between 1 and 5."}
    }

    // Check if user already reviewed this product
    const existing = await db
        .select({id: review.id})
        .from(review)
        .where(and(
            eq(review.userId, session.user.id),
            eq(review.productId, data.productId)
        ))
        .limit(1)

    if (existing.length > 0) {
        return {success: false, error: "You have already reviewed this product."}
    }

    try {
        await db.insert(review).values({
            userId: session.user.id,
            productId: data.productId,
            rating: data.rating,
            title: data.title.trim() || null,
            body: data.body.trim() || null,
            isApproved: false, // Requires admin approval
        })

        return {success: true}
    } catch (error) {
        console.error("Error submitting review:", error)
        return {success: false, error: "Failed to submit review. Please try again."}
    }
}

// ── Get approved reviews for a product (public) ──

export interface PublicReview {
    id: number
    rating: number
    title: string | null
    body: string | null
    createdAt: Date
    userName: string
    userImage: string | null
}

export async function getProductReviews(productId: number): Promise<{
    reviews: PublicReview[]
    averageRating: number
    totalReviews: number
    ratingDistribution: Record<number, number>
}> {
    try {
        const reviews = await db
            .select({
                id: review.id,
                rating: review.rating,
                title: review.title,
                body: review.body,
                createdAt: review.createdAt,
                userName: user.name,
                userImage: user.image,
            })
            .from(review)
            .innerJoin(user, eq(review.userId, user.id))
            .where(and(
                eq(review.productId, productId),
                eq(review.isApproved, true)
            ))
            .orderBy(desc(review.createdAt))

        const totalReviews = reviews.length
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0

        const ratingDistribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        reviews.forEach(r => {
            ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1
        })

        return {reviews, averageRating, totalReviews, ratingDistribution}
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return {reviews: [], averageRating: 0, totalReviews: 0, ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}}
    }
}

// ── Check if user can review a product ──

export async function canUserReview(productId: number): Promise<{
    canReview: boolean
    reason?: string
}> {
    const session = await checkAuth()

    if (!session?.user) {
        return {canReview: false, reason: "login"}
    }

    const existing = await db
        .select({id: review.id})
        .from(review)
        .where(and(
            eq(review.userId, session.user.id),
            eq(review.productId, productId)
        ))
        .limit(1)

    if (existing.length > 0) {
        return {canReview: false, reason: "already_reviewed"}
    }

    return {canReview: true}
}

// ── Admin: Get all reviews for moderation ──

export interface AdminReviewItem {
    id: number
    rating: number
    title: string | null
    body: string | null
    isApproved: boolean
    createdAt: Date
    userName: string
    userEmail: string
    productName: string
    productId: number
}

export async function getAdminReviews(): Promise<AdminReviewItem[]> {
    try {
        return await db
            .select({
                id: review.id,
                rating: review.rating,
                title: review.title,
                body: review.body,
                isApproved: review.isApproved,
                createdAt: review.createdAt,
                userName: user.name,
                userEmail: user.email,
                productName: product.name,
                productId: product.id,
            })
            .from(review)
            .innerJoin(user, eq(review.userId, user.id))
            .innerJoin(product, eq(review.productId, product.id))
            .orderBy(desc(review.createdAt))
    } catch (error) {
        console.error("Error fetching admin reviews:", error)
        return []
    }
}

// ── Admin: Approve / Reject review ──

export async function updateReviewApproval(
    reviewId: number,
    isApproved: boolean
): Promise<{ success: boolean; error?: string }> {
    const session = await checkAuth()

    if (!session?.user || session.user.role !== "admin") {
        return {success: false, error: "Unauthorized"}
    }

    try {
        await db
            .update(review)
            .set({isApproved})
            .where(eq(review.id, reviewId))

        revalidatePath("/admin/dashboard/reviews")
        return {success: true}
    } catch (error) {
        console.error("Error updating review status:", error)
        return {success: false, error: "Failed to update review status"}
    }
}

// ── Admin: Delete review ──

export async function deleteReview(
    reviewId: number
): Promise<{ success: boolean; error?: string }> {
    const session = await checkAuth()

    if (!session?.user || session.user.role !== "admin") {
        return {success: false, error: "Unauthorized"}
    }

    try {
        await db.delete(review).where(eq(review.id, reviewId))
        revalidatePath("/admin/dashboard/reviews")
        return {success: true}
    } catch (error) {
        console.error("Error deleting review:", error)
        return {success: false, error: "Failed to delete review"}
    }
}
