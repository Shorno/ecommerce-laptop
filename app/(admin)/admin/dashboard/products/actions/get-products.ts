"use server"

import {db} from "@/db/config";

export default async function getProducts() {
    return await db.query.product.findMany({
        with: {
            category: true,
            subCategory: true,
            images: true,
        },
        orderBy: (product, { desc }) => [desc(product.createdAt)]
    })
}

