"use server"

import { db } from "@/db/config"
import { order, orderItem, payment } from "@/db/schema"
import { productVariant } from "@/db/schema/product"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { CreateOrderData, OrderResponse } from "@/lib/types/order"
import { eq } from "drizzle-orm"

function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `ORD-${timestamp}-${random}`
}

export async function createOrder(data: CreateOrderData): Promise<OrderResponse> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false,
                error: "You must be logged in to place an order"
            }
        }

        const { shipping, items } = data

        if (!items || items.length === 0) {
            return {
                success: false,
                error: "Cart is empty"
            }
        }

        // Calculate totals
        const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0)
        const shippingAmount = 0
        const totalAmount = subtotal + shippingAmount

        const orderNumber = generateOrderNumber()

        const result = await db.transaction(async (tx) => {
            // Verify stock availability and reserve stock — now checks VARIANT stock
            for (const item of items) {
                if (item.variantId) {
                    const [variantData] = await tx
                        .select({
                            stock: productVariant.stock,
                            id: productVariant.id
                        })
                        .from(productVariant)
                        .where(eq(productVariant.id, item.variantId))
                        .limit(1)

                    if (!variantData) {
                        throw new Error(`Variant for ${item.name} not found`)
                    }

                    if (variantData.stock < item.quantity) {
                        throw new Error(`Insufficient stock for ${item.name}. Available: ${variantData.stock}, Requested: ${item.quantity}`)
                    }

                    // Update variant stock
                    const newStock = variantData.stock - item.quantity
                    await tx
                        .update(productVariant)
                        .set({
                            stock: newStock,
                            inStock: newStock > 0
                        })
                        .where(eq(productVariant.id, item.variantId))
                }
            }

            const [newOrder] = await tx.insert(order).values({
                orderNumber,
                userId: session.user.id,
                status: "pending",
                subtotal: subtotal.toString(),
                shippingAmount: shippingAmount.toString(),
                totalAmount: totalAmount.toString(),
                customerFullName: shipping.fullName,
                customerEmail: shipping.email,
                customerPhone: shipping.phone,
                shippingAddressLine: shipping.addressLine,
                shippingCity: shipping.city,
                shippingArea: shipping.area,
                shippingPostalCode: shipping.postalCode,
                shippingCountry: shipping.country,
            }).returning()

            const orderItemsData = items.map(item => ({
                orderId: newOrder.id,
                productId: item.id,
                variantId: item.variantId || null,
                productName: item.name,
                variantLabel: item.variantLabel || "Default",
                productImage: item.image || "",
                quantity: item.quantity,
                unitPrice: item.price.toString(),
                subtotal: item.subtotal.toString(),
                totalAmount: item.subtotal.toString(),
            }))

            await tx.insert(orderItem).values(orderItemsData)

            await tx.insert(payment).values({
                orderId: newOrder.id,
                paymentMethod: shipping.paymentType === "cod" ? "cod" : "bkash",
                paymentProvider: shipping.paymentType === "cod" ? "COD" : null,
                status: "pending",
                amount: totalAmount.toString(),
                currency: "BDT",
            })

            return {
                orderId: newOrder.id,
                orderNumber: newOrder.orderNumber,
            }
        })

        return {
            success: true,
            orderId: result.orderId,
            orderNumber: result.orderNumber,
        }
    } catch (error) {
        console.error("Error creating order:", error)

        if (error instanceof Error) {
            if (error.message.includes("Insufficient stock")) {
                return { success: false, error: error.message }
            }
            if (error.message.includes("not found")) {
                return { success: false, error: error.message }
            }
        }

        return {
            success: false,
            error: "Failed to create order. Please try again."
        }
    }
}

export async function getOrderById(orderId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return null
        }

        const [orderData] = await db.query.order.findMany({
            where: (order, { eq, and }) => and(
                eq(order.id, orderId),
                eq(order.userId, session.user.id)
            ),
            with: {
                items: true,
                payment: true,
            },
        })

        return orderData
    } catch (error) {
        console.error("Error fetching order:", error)
        return null
    }
}
