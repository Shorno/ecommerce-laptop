"use server"

import {db} from "@/db/config";
import {eq, asc} from "drizzle-orm";
import {brand} from "@/db/schema/brand";

export async function getBrandsForSelect() {
    return await db
        .select({id: brand.id, name: brand.name})
        .from(brand)
        .where(eq(brand.isActive, true))
        .orderBy(asc(brand.displayOrder), asc(brand.name))
}
