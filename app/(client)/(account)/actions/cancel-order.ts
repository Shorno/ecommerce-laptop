"use server"

import { db } from "@/db/config"
import { order } from "@/db/schema/order"
import { product } from "@/db/schema/product"
import { payment } from "@/db/schema/payment"
import { and, eq } from "drizzle-orm"
import { checkAuth } from "@/app/actions/auth/checkAuth"
import { revalidatePath } from "next/cache"

interface CancelOrderResponse {
    success: boolean
    message?: string
    error?: string
}

export async function cancelOrder(orderId: number): Promise<CancelOrderResponse> {
    try {
        const session = await checkAuth()

        if (!session?.user?.id) {
            return {
                success: false,
                error: "You must be logged in"
            }
        }

        // Verify order belongs to user and is in a cancellable state
        const [orderData] = await db
            .select()
            .from(order)
            .where(
                and(
                    eq(order.id, orderId),
                    eq(order.userId, session.user.id)
                )
            )
            .limit(1)

        if (!orderData) {
            return {
                success: false,
                error: "Order not found"
            }
        }

        // Only pending and confirmed orders can be cancelled by the customer
        if (!["pending", "confirmed"].includes(orderData.status)) {
            return {
                success: false,
                error: `Cannot cancel order with status "${orderData.status}". Only pending or confirmed orders can be cancelled.`
            }
        }

        await db.transaction(async (tx) => {
            // Restore variant stock for each order item
            const orderItems = await tx.query.orderItem.findMany({
                where: (oi, { eq }) => eq(oi.orderId, orderId),
            })

            const { productVariant } = await import("@/db/schema/product")

            for (const item of orderItems) {
                if (item.variantId) {
                    const [variantData] = await tx
                        .select({ stock: productVariant.stock })
                        .from(productVariant)
                        .where(eq(productVariant.id, item.variantId))
                        .limit(1)

                    if (variantData) {
                        const restoredStock = variantData.stock + item.quantity
                        await tx
                            .update(productVariant)
                            .set({
                                stock: restoredStock,
                                inStock: true,
                            })
                            .where(eq(productVariant.id, item.variantId))
                    }
                }
            }

            // Update order status to cancelled
            await tx
                .update(order)
                .set({
                    status: "cancelled",
                    cancelledAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(order.id, orderId))

            // Update payment status to cancelled
            await tx
                .update(payment)
                .set({
                    status: "cancelled",
                    updatedAt: new Date(),
                })
                .where(eq(payment.orderId, orderId))
        })

        revalidatePath(`/account/orders/${orderId}`)
        revalidatePath("/account/orders")

        return {
            success: true,
            message: "Order cancelled successfully. Stock has been restored."
        }
    } catch (error) {
        console.error("Error cancelling order:", error)
        return {
            success: false,
            error: "Failed to cancel order. Please try again."
        }
    }
}
