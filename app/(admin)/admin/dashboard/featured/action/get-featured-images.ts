"use server"


import {db} from "@/db/config";
import {featuredImages} from "@/db/schema/featured-images";
import {asc} from "drizzle-orm";

export default async function getFeaturedImages() {
    return await db.select().from(featuredImages).orderBy(asc(featuredImages.placement), asc(featuredImages.id))
}