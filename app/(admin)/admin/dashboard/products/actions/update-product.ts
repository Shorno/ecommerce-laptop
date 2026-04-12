"use server"

import {UpdateProductFormValues, updateProductSchema} from "@/lib/schemas/product.schema";
import {z} from "zod";
import {db} from "@/db/config";
import {product, productImage, productOption, productVariant} from "@/db/schema/product";
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
        const {id, additionalImages, options, variants, ...updateData} = validData

        await db.transaction(async (tx) => {
            // 1. Update product
            const updatedProduct = await tx
                .update(product)
                .set({
                    ...updateData,
                    subCategoryId: updateData.subCategoryId || null,
                    minPrice: Math.min(...variants.map(v => parseFloat(v.price))).toString(),
                })
                .where(eq(product.id, id))
                .returning()

            if (!updatedProduct.length) {
                throw new Error("Product not found")
            }

            // 2. Replace additional images
            await tx.delete(productImage).where(eq(productImage.productId, id))
            if (additionalImages && additionalImages.length > 0) {
                await tx.insert(productImage).values(
                    additionalImages.map((imageUrl) => ({
                        productId: id,
                        imageUrl,
                    }))
                )
            }

            // 3. Replace options
            await tx.delete(productOption).where(eq(productOption.productId, id))
            if (options && options.length > 0) {
                await tx.insert(productOption).values(
                    options.map((opt) => ({
                        productId: id,
                        name: opt.name,
                        position: opt.position,
                        values: JSON.stringify(opt.values),
                    }))
                )
            }

            // 4. Replace variants
            await tx.delete(productVariant).where(eq(productVariant.productId, id))
            await tx.insert(productVariant).values(
                variants.map((v, index) => ({
                    productId: id,
                    sku: v.sku || null,
                    price: v.price,
                    stock: v.stock,
                    inStock: v.inStock,
                    optionValues: Object.keys(v.optionValues || {}).length > 0
                        ? JSON.stringify(v.optionValues)
                        : null,
                    sortOrder: index,
                }))
            )
        })

        revalidatePath("/products")
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: null,
            message: "Product updated successfully",
        }
    } catch (error) {
        console.error("Error updating product:", error)

        if (error instanceof Error && error.message === "Product not found") {
            return {
                success: false,
                status: 404,
                error: "Product not found",
            }
        }

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
