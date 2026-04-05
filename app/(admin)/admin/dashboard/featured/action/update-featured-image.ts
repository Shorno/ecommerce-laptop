"use server"

import {z} from "zod"
import {eq} from "drizzle-orm"
import {db} from "@/db/config"
import {revalidatePath} from "next/cache"
import {ActionResult} from "@/app/(admin)/admin/dashboard/category/actions/category/create-category";
import {EditFeaturedImageFormValues, editFeaturedImageSchema} from "@/lib/schemas/featured.scheam";
import {featuredImages} from "@/db/schema";
import {checkAuth} from "@/app/actions/auth/checkAuth";


export default async function updateFeaturedImage(
    formData: EditFeaturedImageFormValues
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
        const result = editFeaturedImageSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data

        const updated = await db
            .update(featuredImages)
            .set({
                image: validData.image,
                title: validData.title,
                subtitle: validData.subtitle,
                cta: validData.cta,
                ctaLink: validData.ctaLink,
                updatedAt: new Date(),
            })
            .where(eq(featuredImages.id, validData.id))
            .returning()

        if (!updated.length) {
            return {
                success: false,
                status: 404,
                error: "Featured image not found",
            }
        }

        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: updated[0],
            message: "Featured image updated successfully",
        }
    } catch (error) {
        console.error("Error updating featured image:", error)
        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
