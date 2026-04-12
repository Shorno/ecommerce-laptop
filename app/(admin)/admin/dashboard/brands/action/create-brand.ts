"use server"

import {z} from "zod"
import {db} from "@/db/config"
import {revalidatePath} from "next/cache"
import {ActionResult} from "@/app/(admin)/admin/dashboard/category/actions/category/create-category";
import {createBrandSchema, CreateBrandFormValues} from "@/lib/schemas/brand.schema";
import {brand} from "@/db/schema/brand";
import {checkAuth} from "@/app/actions/auth/checkAuth";


export default async function createBrand(
    formData: CreateBrandFormValues
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
        const result = createBrandSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data

        const newBrand = await db
            .insert(brand)
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
            data: newBrand[0],
            message: "Brand created successfully",
        }
    } catch (error) {
        console.error("Error creating brand:", error)
        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
