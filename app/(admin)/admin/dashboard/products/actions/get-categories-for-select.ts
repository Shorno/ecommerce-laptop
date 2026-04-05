"use server"

import {db} from "@/db/config";
import {eq} from "drizzle-orm";
import {category} from "@/db/schema/category";

export async function getCategoriesForSelect() {
    return await db.query.category.findMany({
        where: eq(category.isActive, true),
        with: {
            subCategory: {
                where: (subCategory, { eq }) => eq(subCategory.isActive, true)
            }
        },
        orderBy: (category, { asc }) => [asc(category.displayOrder)]
    })
}

