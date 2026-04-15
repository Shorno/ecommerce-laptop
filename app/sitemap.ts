import type {MetadataRoute} from "next"
import {db} from "@/db/config"
import {product} from "@/db/schema/product"
import {category} from "@/db/schema/category"
import {eq} from "drizzle-orm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${siteUrl}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
    ]

    // Dynamic product pages
    let productPages: MetadataRoute.Sitemap = []
    try {
        const products = await db
            .select({slug: product.slug, updatedAt: product.updatedAt})
            .from(product)
            .where(eq(product.isActive, true))

        productPages = products.map(p => ({
            url: `${siteUrl}/product/${p.slug}`,
            lastModified: p.updatedAt ?? new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }))
    } catch {
        // DB unavailable — skip product pages
    }

    // Dynamic category pages
    let categoryPages: MetadataRoute.Sitemap = []
    try {
        const categories = await db
            .select({slug: category.slug, updatedAt: category.updatedAt})
            .from(category)

        categoryPages = categories.map(c => ({
            url: `${siteUrl}/products?category=${c.slug}`,
            lastModified: c.updatedAt ?? new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }))
    } catch {
        // DB unavailable — skip category pages
    }

    return [...staticPages, ...productPages, ...categoryPages]
}
