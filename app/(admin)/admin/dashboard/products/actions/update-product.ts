"use server"

import {UpdateProductFormValues, updateProductSchema} from "@/lib/schemas/product.schema";
import {z} from "zod";
import {db} from "@/db/config";
import {product, productImage} from "@/db/schema/product";
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

export default async function updateProduct(
    formData: UpdateProductFormValues
): Promise<ActionResult<UpdateProductFormValues>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = updateProductSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data
        const { id, additionalImages, ...updateData } = validData

        const updatedProduct = await db
            .update(product)
            .set({
                ...updateData,
                price: updateData.price,
                subCategoryId: updateData.subCategoryId || null,
            })
            .where(eq(product.id, id))
            .returning()

        if (!updatedProduct.length) {
            return {
                success: false,
                status: 404,
                error: "Product not found",
            }
        }

        // Update additional images: delete existing and insert new ones
        if (additionalImages !== undefined) {
            // Delete existing additional images
            await db.delete(productImage).where(eq(productImage.productId, id))

            // Insert new additional images if provided
            if (additionalImages.length > 0) {
                await db.insert(productImage).values(
                    additionalImages.map((imageUrl) => ({
                        productId: id,
                        imageUrl: imageUrl,
                    }))
                )
            }
        }

        revalidatePath("/products")
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: {
                ...updatedProduct[0],
                additionalImages,
                subCategoryId: updatedProduct[0].subCategoryId ?? undefined,
            },
            message: "Product updated successfully",
        }
    } catch (error) {
        console.error("Error updating product:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
