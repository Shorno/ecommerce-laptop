"use server"

import {db} from "@/db/config";
import {eq, desc} from "drizzle-orm";
import {CustomerAddress, customerAddress} from "@/db/schema";
import {order} from "@/db/schema/order";
import {checkAuth} from "@/app/actions/auth/checkAuth";


export async function getCustomerInfo(): Promise<CustomerAddress | null> {
    const session = await checkAuth()
    if (!session?.user.id) {
        return null
    }
    try {
        const addresses = await db.query.customerAddress.findMany({
            where: eq(customerAddress.userId, session.user.id)
        });

        if (addresses && addresses.length > 0) {
            return addresses[0];
        }

        const lastOrder = await db.query.order.findFirst({
            where: eq(order.userId, session.user.id),
            orderBy: [desc(order.createdAt)]
        });

        if (lastOrder) {
            const [newAddress] = await db.insert(customerAddress).values({
                userId: session.user.id,
                fullName: lastOrder.customerFullName,
                phone: lastOrder.customerPhone,
                addressLine: lastOrder.shippingAddressLine,
                city: lastOrder.shippingCity,
                area: lastOrder.shippingArea || "",
                postalCode: lastOrder.shippingPostalCode,
                country: lastOrder.shippingCountry,
            }).returning();

            return newAddress;
        }

        return null;
    } catch (error) {
        console.log(error)
        return null
    }

}