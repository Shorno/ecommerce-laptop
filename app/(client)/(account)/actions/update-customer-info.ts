"use server"

import {db} from "@/db/config";
import {eq} from "drizzle-orm";
import {customerAddress} from "@/db/schema";
import {addressSchema} from "@/lib/schemas/address.scheam";
import {revalidatePath} from "next/cache";
import {checkAuth} from "@/app/actions/auth/checkAuth";

export async function updateCustomerInfo(data: unknown) {
    const session = await checkAuth()
    if (!session?.user.id) {
        return {
            success: false,
            message: "Login required"
        }
    }

    const validationResult = addressSchema.safeParse(data)

    if (!validationResult.success) {
        return {
            success: false,
            message: "Invalid data",
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const validatedData = validationResult.data

    try {
        // Check if customer address exists
        const existingAddress = await db.query.customerAddress.findFirst({
            where: eq(customerAddress.userId, session.user.id)
        });

        if (existingAddress) {
            // Update existing address
            await db.update(customerAddress)
                .set({
                    fullName: validatedData.fullName,
                    phone: validatedData.phone,
                    addressLine: validatedData.addressLine,
                    city: validatedData.city,
                    area: validatedData.area,
                    postalCode: validatedData.postalCode,
                    country: validatedData.country,
                    updatedAt: new Date()
                })
                .where(eq(customerAddress.userId, session.user.id));
        } else {
            await db.insert(customerAddress).values({
                userId: session.user.id,
                fullName: validatedData.fullName,
                phone: validatedData.phone,
                addressLine: validatedData.addressLine,
                city: validatedData.city,
                area: validatedData.area,
                postalCode: validatedData.postalCode,
                country: validatedData.country,
            });
        }

        revalidatePath('/account/profile')

        return {
            success: true,
            message: "Information updated successfully"
        }
    } catch (error) {
        console.error("Error updating customer info:", error)
        return {
            success: false,
            message: "Failed to update information"
        }
    }
}

