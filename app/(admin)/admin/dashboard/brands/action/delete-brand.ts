"use server"

import {brand} from "@/db/schema/brand"
import {eq} from "drizzle-orm"
import {db} from "@/db/config";
import {revalidatePath} from "next/cache";

export default async function deleteBrand(brandId: number) {
    try {
        const existingBrand = await db
            .select()
            .from(brand)
            .where(eq(brand.id, brandId))
            .limit(1)

        if (existingBrand.length === 0) {
            return {
                success: false,
                status: 404,
                error: "Brand not found",
            }
        }

        await db
            .delete(brand)
            .where(eq(brand.id, brandId))

        revalidatePath("/")

        return {
            success: true,
            message: "Brand deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting brand:", error)
        return {
            success: false,
            status: 500,
            error: "Failed to delete brand",
        }
    }
}
