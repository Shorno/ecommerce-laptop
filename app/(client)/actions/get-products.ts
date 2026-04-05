"use server"

import {db} from "@/db/config"
import {product} from "@/db/schema"
import {and, asc, desc, eq, gte, ilike, lte} from "drizzle-orm"

interface GetProductsParams {
    category?: string
    subcategory?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    search?: string
}

export async function getProducts(params: GetProductsParams) {
    const {
        category,
        subcategory,
        sort = "newest",
        minPrice,
        maxPrice,
        inStock,
        search,
    } = params

    // Build where conditions
    const conditions = []

    if (category) {
        const categoryData = await db.query.category.findFirst({
            where: (cat, {eq}) => eq(cat.slug, category),
        })
        if (categoryData) {
            conditions.push(eq(product.categoryId, categoryData.id))
        }
    }

    if (subcategory) {
        const subCategoryData = await db.query.subCategory.findFirst({
            where: (subCat, {eq}) => eq(subCat.slug, subcategory),
        })
        if (subCategoryData) {
            conditions.push(eq(product.subCategoryId, subCategoryData.id))
        }
    }

    if (minPrice) {
        conditions.push(gte(product.price, minPrice))
    }

    if (maxPrice) {
        conditions.push(lte(product.price, maxPrice))
    }

    if (inStock === "true") {
        conditions.push(eq(product.inStock, true))
    }

    if (search) {
        conditions.push(ilike(product.name, `%${search}%`))
    }

    // Build order by
    let orderBy
    switch (sort) {
        case "price-asc":
            orderBy = [asc(product.price)]
            break
        case "price-desc":
            orderBy = [desc(product.price)]
            break
        case "name-asc":
            orderBy = [asc(product.name)]
            break
        case "name-desc":
            orderBy = [desc(product.name)]
            break
        case "newest":
        default:
            orderBy = [desc(product.createdAt)]
            break
    }

    return await db.query.product.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
            category: {
                columns: {
                    slug: true,
                    name: true,
                },
            },
            subCategory: {
                columns: {
                    name: true,
                },
            },
        },
        orderBy,
    })
}

