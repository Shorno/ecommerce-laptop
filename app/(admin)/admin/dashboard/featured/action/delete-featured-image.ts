"use server"

import { db } from "@/db/config"
import { revalidatePath } from "next/cache"
import {featuredImages} from "@/db/schema";
import {eq} from "drizzle-orm";
import {checkAuth} from "@/app/actions/auth/checkAuth";


export default async function deleteFeaturedImage(imageId: number) {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const deleted = await db
            .delete(featuredImages)
            .where(eq(featuredImages.id, imageId))
            .returning()

        if (!deleted.length) {
            return {
                success: false,
                status: 404,
                error: "Featured image not found",
            }
        }

        // Revalidate only client-facing routes (not admin dashboard)
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            message: "Featured image deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting featured image:", error)
        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
