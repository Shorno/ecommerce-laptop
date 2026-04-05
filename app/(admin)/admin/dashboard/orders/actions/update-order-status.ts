"use server"

import { db } from "@/db/config"
import {order, OrderStatus} from "@/db/schema"
import { eq } from "drizzle-orm"

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
    try {
        const updateData: Partial<typeof order.$inferInsert> = { status }

        switch (status) {
            case "confirmed":
                updateData.confirmedAt = new Date()
                break
            case "shipped":
                updateData.shippedAt = new Date()
                break
            case "delivered":
                updateData.deliveredAt = new Date()
                break
            case "cancelled":
                updateData.cancelledAt = new Date()
                break
        }

        await db
            .update(order)
            .set(updateData)
            .where(eq(order.id, orderId))

        return {
            success: true,
            message: "Order status updated successfully"
        }
    } catch (error) {
        console.error("Error updating order status:", error)
        return {
            success: false,
            error: "Failed to update order status"
        }
    }
}
