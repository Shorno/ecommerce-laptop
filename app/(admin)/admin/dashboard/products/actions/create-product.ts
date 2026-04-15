"use server"

import {CreateProductFormValues, createProductSchema} from "@/lib/schemas/product.schema";
import {z} from "zod";
import {db} from "@/db/config";
import {product, productImage, productOption, productVariant} from "@/db/schema/product";
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

export default async function createProduct(
    formData: CreateProductFormValues
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
        const result = createProductSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data
        const {additionalImages, options, variants, ...productData} = validData

        await db.transaction(async (tx) => {
            // 1. Insert product
            const [newProduct] = await tx.insert(product).values({
                ...productData,
                subCategoryId: productData.subCategoryId || null,
                brandId: productData.brandId || null,
                minPrice: Math.min(...variants.map(v => parseFloat(v.price))).toString(),
            }).returning()

            const productId = newProduct.id

            // 2. Insert additional images
            if (additionalImages && additionalImages.length > 0) {
                await tx.insert(productImage).values(
                    additionalImages.map((imageUrl) => ({
                        productId,
                        imageUrl,
                    }))
                )
            }

            // 3. Insert options
            if (options && options.length > 0) {
                await tx.insert(productOption).values(
                    options.map((opt) => ({
                        productId,
                        name: opt.name,
                        position: opt.position,
                        values: JSON.stringify(opt.values),
                    }))
                )
            }

            // 4. Insert variants
            await tx.insert(productVariant).values(
                variants.map((v, index) => ({
                    productId,
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
            status: 201,
            data: null,
            message: "Product created successfully",
        }
    } catch (error) {
        console.error("Error creating product:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
