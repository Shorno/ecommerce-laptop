"use server"

import {db} from "@/db/config";
import {desc, eq} from "drizzle-orm";
import {order, type Order, type OrderItem} from "@/db/schema/order";
import {checkAuth} from "@/app/actions/auth/checkAuth";

export type CustomerOrder = Order & {
    items: OrderItem[]
}

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
    const session = await checkAuth()
    if (!session?.user.id) {
        return []
    }

    try {
        const orders = await db.query.order.findMany({
            where: eq(order.userId, session.user.id),
            with: {
                items: true,
            },
            orderBy: [desc(order.createdAt)],
        })

        return orders as CustomerOrder[]
    } catch (error) {
        console.error("Error fetching customer orders:", error)
        return []
    }
}
