"use server"

import {category} from "@/db/schema/category"
import {eq} from "drizzle-orm"
import {UpdateCategoryFormValues} from "@/lib/schemas/category.scheam";
import {db} from "@/db/config";
import {revalidatePath} from "next/cache";

export default async function updateCategory(data: UpdateCategoryFormValues) {
    try {
        // Check if category exists
        const existingCategory = await db
            .select()
            .from(category)
            .where(eq(category.id, data.id))
            .limit(1)

        if (existingCategory.length === 0) {
            return {
                success: false,
                status: 404,
                error: "Category not found",
            }
        }

        await db
            .update(category)
            .set({
                name: data.name,
                slug: data.slug,
                image: data.image,
                isActive: data.isActive,
                displayOrder: data.displayOrder,
                updatedAt: new Date(),
            })
            .where(eq(category.id, data.id))

        // Revalidate only client-facing routes (not admin dashboard)
        revalidatePath("/products")
        revalidatePath("/")

        return {
            success: true,
            message: "Category updated successfully",
        }
    } catch (error) {
        console.error("Error updating category:", error)
        return {
            success: false,
            status: 500,
            error: "Failed to update category",
        }
    }
}
