"use server"

import {db} from "@/db/config";
import {brand} from "@/db/schema/brand";
import {asc} from "drizzle-orm";

export default async function getBrands() {
    return await db
        .select()
        .from(brand)
        .orderBy(asc(brand.displayOrder), asc(brand.name))
}
