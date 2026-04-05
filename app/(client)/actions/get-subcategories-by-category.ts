"use server"

import { db } from "@/db/config"
import { subCategory } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getSubCategoriesByCategory(categorySlug: string) {
    const category = await db.query.category.findFirst({
        where: (cat, { eq }) => eq(cat.slug, categorySlug),
    })

    if (!category) return []

    return await db.query.subCategory.findMany({
        where: and(
            eq(subCategory.categoryId, category.id),
            eq(subCategory.isActive, true)
        ),
        orderBy: (subCat, { asc }) => [asc(subCat.displayOrder)],
    })
}

