"use server"

import { db } from "@/db/config"
import { order, product, user, category } from "@/db/schema"
import { count, sum, eq, sql, desc, gte } from "drizzle-orm"

export interface DashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    totalCustomers: number
    pendingOrders: number
    processingOrders: number
    deliveredOrders: number
    cancelledOrders: number
    recentOrders: {
        id: number
        orderNumber: string
        customerFullName: string
        customerEmail: string
        totalAmount: string
        status: string
        createdAt: Date
    }[]
    ordersByStatus: { status: string; count: number }[]
    revenueByMonth: { month: string; revenue: number; orders: number }[]
    topProducts: { name: string; totalSold: number; revenue: number }[]
    totalCategories: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        // Run all independent queries in parallel
        const [
            orderCountResult,
            revenueResult,
            productCountResult,
            customerCountResult,
            categoryCountResult,
            pendingOrdersResult,
            processingOrdersResult,
            deliveredOrdersResult,
            cancelledOrdersResult,
            ordersByStatusResult,
            recentOrdersResult,
            revenueByMonthResult,
            topProductsResult,
        ] = await Promise.all([
            // Total orders
            db.select({ value: count() }).from(order),

            // Total revenue (from delivered / non-cancelled orders)
            db.select({ value: sum(order.totalAmount) }).from(order)
                .where(
                    sql`${order.status} NOT IN ('cancelled', 'refunded')`
                ),

            // Total products
            db.select({ value: count() }).from(product),

            // Total customers (users with role = 'user')
            db.select({ value: count() }).from(user)
                .where(eq(user.role, "user")),

            // Total categories
            db.select({ value: count() }).from(category),

            // Pending orders
            db.select({ value: count() }).from(order)
                .where(eq(order.status, "pending")),

            // Processing orders
            db.select({ value: count() }).from(order)
                .where(eq(order.status, "processing")),

            // Delivered orders
            db.select({ value: count() }).from(order)
                .where(eq(order.status, "delivered")),

            // Cancelled orders
            db.select({ value: count() }).from(order)
                .where(eq(order.status, "cancelled")),



            // Orders by status
            db.select({
                status: order.status,
                count: count(),
            }).from(order).groupBy(order.status),

            // Recent 5 orders
            db.query.order.findMany({
                orderBy: desc(order.createdAt),
                limit: 5,
            }),

            // Revenue by month (last 6 months)
            db.select({
                month: sql<string>`TO_CHAR(${order.createdAt}, 'Mon')`,
                monthNum: sql<number>`EXTRACT(MONTH FROM ${order.createdAt})`,
                revenue: sql<number>`COALESCE(SUM(CASE WHEN ${order.status} NOT IN ('cancelled', 'refunded') THEN CAST(${order.totalAmount} AS NUMERIC) ELSE 0 END), 0)`,
                orders: count(),
            })
                .from(order)
                .where(gte(order.createdAt, sql`NOW() - INTERVAL '6 months'`))
                .groupBy(
                    sql`TO_CHAR(${order.createdAt}, 'Mon')`,
                    sql`EXTRACT(MONTH FROM ${order.createdAt})`,
                )
                .orderBy(sql`EXTRACT(MONTH FROM ${order.createdAt})`),

            // Top 5 products by quantity sold
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
                LIMIT 5
            `),
        ])

        return {
            totalOrders: orderCountResult[0]?.value ?? 0,
            totalRevenue: parseFloat(String(revenueResult[0]?.value ?? "0")),
            totalProducts: productCountResult[0]?.value ?? 0,
            totalCustomers: customerCountResult[0]?.value ?? 0,
            totalCategories: categoryCountResult[0]?.value ?? 0,
            pendingOrders: pendingOrdersResult[0]?.value ?? 0,
            processingOrders: processingOrdersResult[0]?.value ?? 0,
            deliveredOrders: deliveredOrdersResult[0]?.value ?? 0,
            cancelledOrders: cancelledOrdersResult[0]?.value ?? 0,
            ordersByStatus: ordersByStatusResult.map(r => ({
                status: r.status,
                count: r.count,
            })),
            recentOrders: recentOrdersResult.map(o => ({
                id: o.id,
                orderNumber: o.orderNumber,
                customerFullName: o.customerFullName,
                customerEmail: o.customerEmail,
                totalAmount: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt,

            })),
            revenueByMonth: revenueByMonthResult.map(r => ({
                month: r.month,
                revenue: Number(r.revenue),
                orders: r.orders,
            })),
            topProducts: (topProductsResult.rows as { name: string; totalSold: number; revenue: number }[]).map(r => ({
                name: String(r.name),
                totalSold: Number(r.totalSold),
                revenue: Number(r.revenue),
            })),
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            totalOrders: 0,
            totalRevenue: 0,
            totalProducts: 0,
            totalCustomers: 0,
            totalCategories: 0,
            pendingOrders: 0,
            processingOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,

            ordersByStatus: [],
            recentOrders: [],
            revenueByMonth: [],
            topProducts: [],
        }
    }
}
