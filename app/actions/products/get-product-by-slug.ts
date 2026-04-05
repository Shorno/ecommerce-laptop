"use server"
import {db} from "@/db/config";
import {eq} from "drizzle-orm";
import {product} from "@/db/schema/product";

export default async function getProductBySlug(slug: string) {
    try {
        const productData = await db.query.product.findFirst({
            where: eq(product.slug, slug),
            with: {
                category: {
                    columns: {
                        name: true,
                        slug: true
                    }
                },
                subCategory: {
                    columns: {
                        name: true
                    }
                },
                images: true
            }
        });

        if (!productData) {
            return null;
        }

        return productData;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
}

