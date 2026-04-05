"use server"


import {db} from "@/db/config";

export default async function getFeaturedImages() {
    return await db.query.featuredImages.findMany()
}