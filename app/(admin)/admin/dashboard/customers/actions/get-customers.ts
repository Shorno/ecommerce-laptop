"use server"

import {db} from "@/db/config"
import {user} from "@/db/schema/auth-schema"
import {order} from "@/db/schema/order"
import {eq, sql, desc} from "drizzle-orm"

export interface CustomerListItem {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    createdAt: Date
    totalOrders: number
    totalSpent: string
    lastOrderDate: Date | null
}

export async function getCustomers(): Promise<CustomerListItem[]> {
    try {
        const customers = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                createdAt: user.createdAt,
                totalOrders: sql<number>`count(${order.id})::int`,
                totalSpent: sql<string>`coalesce(sum(${order.totalAmount}::numeric), 0)::text`,
                lastOrderDate: sql<Date | null>`max(${order.createdAt})`,
            })
            .from(user)
            .leftJoin(order, eq(user.id, order.userId))
            .groupBy(user.id)
            .orderBy(desc(user.createdAt))

        return customers
    } catch (error) {
        console.error("Error fetching customers:", error)
        return []
    }
}
