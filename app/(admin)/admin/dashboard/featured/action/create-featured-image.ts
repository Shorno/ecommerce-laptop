"use server"

import { z } from "zod"
import { db } from "@/db/config"
import { revalidatePath } from "next/cache"
import {ActionResult} from "@/app/(admin)/admin/dashboard/category/actions/category/create-category";
import {createFeaturedImageSchema} from "@/lib/schemas/featured.scheam";
import {featuredImages} from "@/db/schema/featured-images";
import {checkAuth} from "@/app/actions/auth/checkAuth";


export default async function createFeaturedImage(
    formData: z.infer<typeof createFeaturedImageSchema>
): Promise<ActionResult> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = createFeaturedImageSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data

        const newFeaturedImage = await db
            .insert(featuredImages)
            .values({
                ...validData,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        revalidatePath("/")

        return {
            success: true,
            status: 201,
            data: newFeaturedImage[0],
            message: "Featured image created successfully",
        }
    } catch (error) {
        console.error("Error creating featured image:", error)
        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
