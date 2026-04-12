"use server"

import {z} from "zod"
import {db} from "@/db/config"
import {revalidatePath} from "next/cache"
import {ActionResult} from "@/app/(admin)/admin/dashboard/category/actions/category/create-category";
import {editBrandSchema, EditBrandFormValues} from "@/lib/schemas/brand.schema";
import {brand} from "@/db/schema/brand";
import {eq} from "drizzle-orm";
import {checkAuth} from "@/app/actions/auth/checkAuth";

export default async function updateBrand(
    formData: EditBrandFormValues
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
        const result = editBrandSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const {id, ...data} = result.data

        const existing = await db
            .select()
            .from(brand)
            .where(eq(brand.id, id))
            .limit(1)

        if (existing.length === 0) {
            return {
                success: false,
                status: 404,
                error: "Brand not found",
            }
        }

        const updated = await db
            .update(brand)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(brand.id, id))
            .returning()

        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: updated[0],
            message: "Brand updated successfully",
        }
    } catch (error) {
        console.error("Error updating brand:", error)
        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
