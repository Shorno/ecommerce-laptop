"use server"

import {db} from "@/db/config"
import {user} from "@/db/schema/auth-schema"
import {order, orderItem} from "@/db/schema/order"
import {customerAddress} from "@/db/schema/customer-adress"
import {eq, desc, sql} from "drizzle-orm"

export interface CustomerDetail {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date
    totalOrders: number
    totalSpent: string
    addresses: {
        id: number
        fullName: string
        phone: string
        addressLine: string
        city: string
        area: string
        postalCode: string
        country: string
    }[]
    orders: {
        id: number
        orderNumber: string
        status: string
        totalAmount: string
        itemCount: number
        createdAt: Date
    }[]
}

export async function getCustomerById(customerId: string): Promise<CustomerDetail | null> {
    try {
        // Fetch user
        const [userData] = await db
            .select()
            .from(user)
            .where(eq(user.id, customerId))
            .limit(1)

        if (!userData) return null

        // Fetch aggregate stats
        const [stats] = await db
            .select({
                totalOrders: sql<number>`count(${order.id})::int`,
                totalSpent: sql<string>`coalesce(sum(${order.totalAmount}::numeric), 0)::text`,
            })
            .from(order)
            .where(eq(order.userId, customerId))

        // Fetch addresses
        const addresses = await db
            .select({
                id: customerAddress.id,
                fullName: customerAddress.fullName,
                phone: customerAddress.phone,
                addressLine: customerAddress.addressLine,
                city: customerAddress.city,
                area: customerAddress.area,
                postalCode: customerAddress.postalCode,
                country: customerAddress.country,
            })
            .from(customerAddress)
            .where(eq(customerAddress.userId, customerId))

        // Fetch orders with item count
        const ordersRaw = await db.query.order.findMany({
            where: eq(order.userId, customerId),
            with: {items: true},
            orderBy: desc(order.createdAt),
        })

        const orders = ordersRaw.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            totalAmount: o.totalAmount,
            itemCount: o.items.length,
            createdAt: o.createdAt,
        }))

        return {
            ...userData,
            totalOrders: stats?.totalOrders ?? 0,
            totalSpent: stats?.totalSpent ?? "0",
            addresses,
            orders,
        }
    } catch (error) {
        console.error("Error fetching customer detail:", error)
        return null
    }
}
