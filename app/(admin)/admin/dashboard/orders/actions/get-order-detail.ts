"use server"

import { db } from "@/db/config"
import { order } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getAdminOrderDetail(orderId: number) {
    try {
        const orderData = await db.query.order.findFirst({
            where: eq(order.id, orderId),
            with: {
                items: true,
            },
        })

        return orderData ?? null
    } catch (error) {
        console.error("Error fetching admin order detail:", error)
        return null
    }
}
