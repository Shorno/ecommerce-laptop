"use server"

import { db } from "@/db/config"
import { order, orderItem, payment } from "@/db/schema"
import { product } from "@/db/schema/product"
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
    //remove ssl
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

        // Generate order number
        const orderNumber = generateOrderNumber()

        const result = await db.transaction(async (tx) => {
            // Verify stock availability and reserve stock
            for (const item of items) {
                const [productData] = await tx
                    .select({
                        stockQuantity: product.stockQuantity,
                        id: product.id
                    })
                    .from(product)
                    .where(eq(product.id, item.id))
                    .limit(1)

                if (!productData) {
                    throw new Error(`Product ${item.name} not found`)
                }

                if (productData.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name}. Available: ${productData.stockQuantity}, Requested: ${item.quantity}`)
                }

                // Calculate new stock quantity
                const newStockQuantity = productData.stockQuantity - item.quantity

                // Update stock quantity atomically using Drizzle ORM
                await tx
                    .update(product)
                    .set({
                        stockQuantity: newStockQuantity,
                        inStock: newStockQuantity > 0
                    })
                    .where(eq(product.id, item.id))
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
                productName: item.name,
                productSize: item.size || "N/A",
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
                return {
                    success: false,
                    error: error.message
                }
            }
            if (error.message.includes("not found")) {
                return {
                    success: false,
                    error: error.message
                }
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
            },
        })

        return orderData
    } catch (error) {
        console.error("Error fetching order:", error)
        return null
    }
}
