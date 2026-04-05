"use server"

import { db } from "@/db/config"
import { order } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export async function getOrders() {
    try {
        const orders = await db.query.order.findMany({
            with: {
                items: true,
                payment: true,
            },
            orderBy: desc(order.createdAt),
        })

        return orders.map(order => ({
            ...order,
            itemCount: order.items.length,
            paymentMethod: order.payment?.paymentMethod ?? null,
            paymentStatus: order.payment?.status ?? null,
        }))
    } catch (error) {
        console.error("Error fetching orders:", error)
        return []
    }
}

export async function getOrderById(orderId: number) {
    try {
        const orderData = await db.query.order.findFirst({
            where: eq(order.id, orderId),
            with: {
                items: true,
            },
        })

        return orderData ?? null
    } catch (error) {
        console.error("Error fetching order:", error)
        return null
    }
}
