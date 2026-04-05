"use server"

import { db } from "@/db/config"
import { order, payment } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function deleteOrder(orderId: number) {
    try {
        // First, delete the payment record if it exists (to avoid foreign key constraint)
        await db
            .delete(payment)
            .where(eq(payment.orderId, orderId))

        // Then delete the order (order_items will cascade delete automatically)
        await db
            .delete(order)
            .where(eq(order.id, orderId))

        // No revalidatePath needed - admin dashboard uses TanStack Query only

        return {
            success: true,
            message: "Order deleted successfully"
        }
    } catch (error) {
        console.error("Error deleting order:", error)
        return {
            success: false,
            error: "Failed to delete order"
        }
    }
}
