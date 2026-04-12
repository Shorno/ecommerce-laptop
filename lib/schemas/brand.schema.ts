import * as z from "zod";

export const createBrandSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .max(100, "Name must be at most 100 characters.")
        .trim(),
    slug: z
        .string()
        .min(1, "Slug is required.")
        .max(100, "Slug must be at most 100 characters.")
        .trim(),
    logo: z
        .url("Please enter a valid logo URL.")
        .max(255, "Logo URL must be at most 255 characters."),
    isActive: z.boolean(),
    displayOrder: z.number().int(),
});

export const editBrandSchema = createBrandSchema.extend({
    id: z.number({ error: "Brand ID is required." }).int().nonoptional(),
});

export type CreateBrandFormValues = z.infer<typeof createBrandSchema>;
export type EditBrandFormValues = z.infer<typeof editBrandSchema>;
