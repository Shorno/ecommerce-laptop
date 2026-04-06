

import { db } from "@/db/config"

export async function getSubCategoryBySlug(slug: string, categorySlug: string) {
    const categoryData = await db.query.category.findFirst({
        where: (cat, { eq, and }) =>
            and(eq(cat.slug, categorySlug), eq(cat.isActive, true)),
    })

    if (!categoryData) return null

    return await db.query.subCategory.findFirst({
        where: (subCat, { eq, and }) =>
            and(
                eq(subCat.slug, slug),
                eq(subCat.categoryId, categoryData.id),
                eq(subCat.isActive, true)
            ),
    })
}
