"use server"

import {db} from "@/db/config"
import {eq} from "drizzle-orm"
import {subCategory} from "@/db/schema";

export default async function getSubcategories(categoryId: number) {
    try {
        return await db.query.subCategory.findMany({
            where: eq(subCategory.categoryId, categoryId),
        })
    } catch (error) {
        console.error("Error fetching subcategories:", error)
        return []
    }
}
