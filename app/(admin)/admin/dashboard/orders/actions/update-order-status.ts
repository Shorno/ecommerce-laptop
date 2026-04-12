"use server"

import { db } from "@/db/config"
import { order, OrderStatus } from "@/db/schema"
import { eq } from "drizzle-orm"
import { VALID_TRANSITIONS } from "@/app/(admin)/admin/dashboard/orders/lib/order-transitions"

const STATUS_TIMESTAMPS: Partial<Record<OrderStatus, string>> = {
    confirmed: "confirmedAt",
    shipped: "shippedAt",
    delivered: "deliveredAt",
    cancelled: "cancelledAt",
}

export async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    try {
        // Fetch current order
        const currentOrder = await db.query.order.findFirst({
            where: eq(order.id, orderId),
        })

        if (!currentOrder) {
            return { success: false, error: "Order not found" }
        }

        const currentStatus = currentOrder.status as OrderStatus
        const allowed = VALID_TRANSITIONS[currentStatus] ?? []

        if (!allowed.includes(newStatus)) {
            const friendlyStatus = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)
            const friendlyNew = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)

            if (allowed.length === 0) {
                return {
                    success: false,
                    error: `Cannot change status — "${friendlyStatus}" is a terminal state.`,
                }
            }

            return {
                success: false,
                error: `Cannot move from "${friendlyStatus}" to "${friendlyNew}". Allowed next steps: ${allowed.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}.`,
            }
        }

        // Build update data with the relevant timestamp
        const updateData: Partial<typeof order.$inferInsert> = { status: newStatus }
        const tsKey = STATUS_TIMESTAMPS[newStatus]
        if (tsKey) {
            (updateData as Record<string, unknown>)[tsKey] = new Date()
        }

        await db
            .update(order)
            .set(updateData)
            .where(eq(order.id, orderId))

        return {
            success: true,
            message: `Order status updated to "${newStatus}"`,
        }
    } catch (error) {
        console.error("Error updating order status:", error)
        return {
            success: false,
            error: "Failed to update order status",
        }
    }
}
