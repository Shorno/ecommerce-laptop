"use server"

import {db} from "@/db/config"
import {order, orderItem} from "@/db/schema/order"
import {product} from "@/db/schema/product"
import {category} from "@/db/schema/category"
import {brand} from "@/db/schema/brand"
import {user} from "@/db/schema/auth-schema"
import {review} from "@/db/schema/review"
import {sql, eq, gte, and, desc, count, sum} from "drizzle-orm"

export interface AnalyticsData {
    // Revenue over time (last 12 months)
    revenueByMonth: { month: string; revenue: number; orders: number }[]
    // Sales by category
    salesByCategory: { name: string; revenue: number; orders: number }[]
    // Sales by brand
    salesByBrand: { name: string; revenue: number; orders: number }[]
    // Top 10 products
    topProducts: { name: string; totalSold: number; revenue: number }[]
    // Customer growth (last 12 months)
    customerGrowth: { month: string; newCustomers: number; cumulativeTotal: number }[]
    // Order status distribution
    orderStatusDistribution: { status: string; count: number }[]
    // Summary KPIs
    kpis: {
        totalRevenue: number
        totalOrders: number
        totalCustomers: number
        totalProducts: number
        avgOrderValue: number
        totalReviews: number
        conversionRate: number // orders / customers
    }
    // Daily orders (last 30 days)
    dailyOrders: { date: string; orders: number; revenue: number }[]
    // Payment method breakdown
    paymentMethods: { method: string; count: number; revenue: number }[]
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
    try {
        const [
            revenueByMonthResult,
            salesByCategoryResult,
            salesByBrandResult,
            topProductsResult,
            customerGrowthResult,
            orderStatusResult,
            totalRevenueResult,
            totalOrdersResult,
            totalCustomersResult,
            totalProductsResult,
            totalReviewsResult,
            dailyOrdersResult,
        ] = await Promise.all([
            // Revenue by month (12 months)
            db.execute(sql`
                SELECT
                    TO_CHAR("createdAt", 'Mon YYYY') as month,
                    EXTRACT(YEAR FROM "createdAt") * 100 + EXTRACT(MONTH FROM "createdAt") as sort_key,
                    COALESCE(SUM(CASE WHEN status NOT IN ('cancelled', 'refunded') THEN CAST(total_amount AS NUMERIC) ELSE 0 END), 0)::float as revenue,
                    COUNT(*)::int as orders
                FROM "order"
                WHERE "createdAt" >= NOW() - INTERVAL '12 months'
                GROUP BY TO_CHAR("createdAt", 'Mon YYYY'), sort_key
                ORDER BY sort_key
            `),

            // Sales by category
            db.execute(sql`
                SELECT
                    c.name,
                    COALESCE(SUM(CAST(oi.subtotal AS NUMERIC)), 0)::float as revenue,
                    COUNT(DISTINCT o.id)::int as orders
                FROM order_item oi
                JOIN "order" o ON oi.order_id = o.id
                JOIN product p ON oi.product_id = p.id
                JOIN category c ON p.category_id = c.id
                WHERE o.status NOT IN ('cancelled', 'refunded')
                GROUP BY c.name
                ORDER BY revenue DESC
            `),

            // Sales by brand
            db.execute(sql`
                SELECT
                    COALESCE(b.name, 'No Brand') as name,
                    COALESCE(SUM(CAST(oi.subtotal AS NUMERIC)), 0)::float as revenue,
                    COUNT(DISTINCT o.id)::int as orders
                FROM order_item oi
                JOIN "order" o ON oi.order_id = o.id
                JOIN product p ON oi.product_id = p.id
                LEFT JOIN brand b ON p.brand_id = b.id
                WHERE o.status NOT IN ('cancelled', 'refunded')
                GROUP BY b.name
                ORDER BY revenue DESC
            `),

            // Top 10 products
            db.execute(sql`
                SELECT
                    oi.product_name as name,
                    COALESCE(SUM(oi.quantity), 0)::int as "totalSold",
                    COALESCE(SUM(CAST(oi.subtotal AS NUMERIC)), 0)::float as revenue
                FROM order_item oi
                JOIN "order" o ON oi.order_id = o.id
                WHERE o.status NOT IN ('cancelled', 'refunded')
                GROUP BY oi.product_name
                ORDER BY "totalSold" DESC
                LIMIT 10
            `),

            // Customer growth (12 months)
            db.execute(sql`
                SELECT
                    TO_CHAR(created_at, 'Mon YYYY') as month,
                    EXTRACT(YEAR FROM created_at) * 100 + EXTRACT(MONTH FROM created_at) as sort_key,
                    COUNT(*)::int as "newCustomers"
                FROM "user"
                WHERE role = 'user' AND created_at >= NOW() - INTERVAL '12 months'
                GROUP BY TO_CHAR(created_at, 'Mon YYYY'), sort_key
                ORDER BY sort_key
            `),

            // Order status distribution
            db.select({
                status: order.status,
                count: count(),
            }).from(order).groupBy(order.status),

            // Total revenue
            db.execute(sql`
                SELECT COALESCE(SUM(CAST(total_amount AS NUMERIC)), 0)::float as total
                FROM "order"
                WHERE status NOT IN ('cancelled', 'refunded')
            `),

            // Total orders
            db.select({value: count()}).from(order),

            // Total customers
            db.select({value: count()}).from(user).where(eq(user.role, "user")),

            // Total products
            db.select({value: count()}).from(product),

            // Total reviews
            db.select({value: count()}).from(review),

            // Daily orders (last 30 days)
            db.execute(sql`
                SELECT
                    TO_CHAR("createdAt", 'Mon DD') as date,
                    "createdAt"::date as sort_date,
                    COUNT(*)::int as orders,
                    COALESCE(SUM(CASE WHEN status NOT IN ('cancelled', 'refunded') THEN CAST(total_amount AS NUMERIC) ELSE 0 END), 0)::float as revenue
                FROM "order"
                WHERE "createdAt" >= NOW() - INTERVAL '30 days'
                GROUP BY TO_CHAR("createdAt", 'Mon DD'), "createdAt"::date
                ORDER BY sort_date
            `),
        ])

        const totalRevenue = (totalRevenueResult.rows[0] as any)?.total ?? 0
        const totalOrders = totalOrdersResult[0]?.value ?? 0
        const totalCustomers = totalCustomersResult[0]?.value ?? 0
        const totalProducts = totalProductsResult[0]?.value ?? 0
        const totalReviews = totalReviewsResult[0]?.value ?? 0
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        // Build cumulative customer growth
        let cumulative = 0
        const customerGrowth = (customerGrowthResult.rows as any[]).map(r => {
            cumulative += r.newCustomers
            return {
                month: r.month,
                newCustomers: r.newCustomers,
                cumulativeTotal: cumulative,
            }
        })

        const result: AnalyticsData = {
            revenueByMonth: (revenueByMonthResult.rows as any[]).map(r => ({
                month: r.month,
                revenue: Number(r.revenue) || 0,
                orders: Number(r.orders) || 0,
            })),
            salesByCategory: (salesByCategoryResult.rows as any[]).map(r => ({
                name: r.name,
                revenue: Number(r.revenue) || 0,
                orders: Number(r.orders) || 0,
            })),
            salesByBrand: (salesByBrandResult.rows as any[]).map(r => ({
                name: r.name,
                revenue: Number(r.revenue) || 0,
                orders: Number(r.orders) || 0,
            })),
            topProducts: (topProductsResult.rows as any[]).map(r => ({
                name: r.name,
                totalSold: Number(r.totalSold) || 0,
                revenue: Number(r.revenue) || 0,
            })),
            customerGrowth,
            orderStatusDistribution: orderStatusResult.map(r => ({
                status: r.status,
                count: Number(r.count) || 0,
            })),
            kpis: {
                totalRevenue,
                totalOrders,
                totalCustomers,
                totalProducts,
                avgOrderValue,
                totalReviews,
                conversionRate: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0,
            },
            dailyOrders: (dailyOrdersResult.rows as any[]).map(r => ({
                date: r.date,
                orders: Number(r.orders) || 0,
                revenue: Number(r.revenue) || 0,
            })),
            paymentMethods: [],
        }

        // Ensure clean serialization for Next.js server actions
        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return {
            revenueByMonth: [],
            salesByCategory: [],
            salesByBrand: [],
            topProducts: [],
            customerGrowth: [],
            orderStatusDistribution: [],
            kpis: {totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0, avgOrderValue: 0, totalReviews: 0, conversionRate: 0},
            dailyOrders: [],
            paymentMethods: [],
        }
    }
}
