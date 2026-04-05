"use server"

import {db} from "@/db/config";
import {product} from "@/db/schema/product";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {checkAuth} from "@/app/actions/auth/checkAuth";

export type ActionResult<TData = unknown> =
    | {
    success: true
    status: number
    data: TData
    message?: string
}
    | {
    success: false
    status: number
    error: string
    details?: unknown
}

export default async function deleteProduct(
    id: number
): Promise<ActionResult<{ id: number }>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const deletedProduct = await db
            .delete(product)
            .where(eq(product.id, id))
            .returning()

        if (!deletedProduct.length) {
            return {
                success: false,
                status: 404,
                error: "Product not found",
            }
        }

        // Revalidate only client-facing routes (not admin dashboard)
        revalidatePath("/products")
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: { id },
            message: "Product deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting product:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
