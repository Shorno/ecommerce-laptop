import * as z from "zod"

const productOptionSchema = z.object({
    name: z.string().min(1, "Option name is required."),
    values: z.array(z.string().min(1)).min(1, "At least one value is required."),
    position: z.number().int().min(0),
})

const productVariantSchema = z.object({
    sku: z.string().optional().default(""),
    price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number with up to 2 decimal places.")
        .refine((val) => parseFloat(val) > 0, "Price must be greater than 0."),
    stock: z
        .number()
        .int("Stock must be a whole number.")
        .min(0, "Stock cannot be negative.")
        .default(0),
    inStock: z.boolean().default(true),
    optionValues: z.record(z.string(), z.string()).optional(),
})

export const createProductSchema = z.object({
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters.")
        .max(150, "Product name must be at most 150 characters.")
        .trim(),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters.")
        .max(150, "Slug must be at most 150 characters.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens (e.g., 'my-product')"
        )
        .trim(),
    categoryId: z
        .number({error: "Category is required." })
        .int()
        .positive("Please select a valid category."),
    subCategoryId: z
        .union([z.number().int().positive(), z.undefined()])
        .optional(),
    image: z
        .url("Please enter a valid image URL.")
        .max(255, "Image URL must be at most 255 characters."),
    additionalImages: z
        .array(z.url("Please enter a valid image URL."))
        .max(6, "You can upload a maximum of 6 additional images.")
        .default([]),
    isFeatured: z.boolean().default(false),
    keyFeatures: z.string().optional().default(""),
    description: z.string().optional().default(""),
    specifications: z.string().optional().default(""),
    options: z.array(productOptionSchema).optional().default([]),
    variants: z.array(productVariantSchema).min(1, "At least one variant is required."),
})

export const updateProductSchema = createProductSchema.extend({
    id: z.number({ error: "Product ID is required." }).int().positive(),
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>
export type ProductVariantFormValues = z.infer<typeof productVariantSchema>
export type ProductOptionFormValues = z.infer<typeof productOptionSchema>
