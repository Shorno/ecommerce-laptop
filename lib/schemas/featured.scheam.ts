import * as z from "zod";

export const createFeaturedImageSchema = z.object({
    image: z
        .url("Please enter a valid image URL.")
        .max(255, "Image URL must be at most 255 characters."),
    title: z
        .string()
        .min(2, "Title must be at least 2 characters.")
        .max(100, "Title must be at most 100 characters.")
        .trim(),
    subtitle: z
        .string()
        .max(100, "Subtitle must be at most 100 characters.")
        .trim(),
    cta: z
        .string()
        .max(50, "CTA must be at most 50 characters.")
        .trim(),
    ctaLink: z
        .url("Please enter a valid URL for the CTA link.")
        .max(255, "URL must be at most 255 characters."),
});


export const editFeaturedImageSchema = createFeaturedImageSchema.extend({
    id: z.number({ error: "Featured Image ID is required." }).int().nonoptional(),
});

export type EditFeaturedImageFormValues = z.infer<typeof editFeaturedImageSchema>;

export type  CreateFeaturedImageFormValues = z.infer<typeof createFeaturedImageSchema>;