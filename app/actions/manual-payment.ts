"use server"

import {db} from "@/db/config";
import {order, payment} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {checkAuth} from "@/app/actions/auth/checkAuth";

interface SubmitManualPaymentData {
    orderId: number;
    transactionId: string;
    senderNumber: string;
    paymentMethod: string;
}

interface SubmitManualPaymentResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export async function submitManualPayment(data: SubmitManualPaymentData): Promise<SubmitManualPaymentResponse> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                success: false,
                error: "You must be logged in"
            };
        }

        const {orderId, transactionId, senderNumber} = data;

        // Validate inputs
        if (!transactionId.trim()) {
            return {
                success: false,
                error: "Transaction ID is required"
            };
        }

        if (!senderNumber.trim()) {
            return {
                success: false,
                error: "Sender number is required"
            };
        }

        // Verify order belongs to user
        const [orderData] = await db
            .select()
            .from(order)
            .where(
                and(
                    eq(order.id, orderId),
                    eq(order.userId, session.user.id)
                )
            )
            .limit(1);

        if (!orderData) {
            return {
                success: false,
                error: "Order not found"
            };
        }

        // Check if payment already exists and is not pending
        const [existingPayment] = await db
            .select()
            .from(payment)
            .where(eq(payment.orderId, orderId))
            .limit(1);

        if (!existingPayment) {
            return {
                success: false,
                error: "Payment record not found"
            };
        }

        if (existingPayment.status === "completed") {
            return {
                success: false,
                error: "Payment already completed"
            };
        }

        // Update payment with manual verification data
        await db
            .update(payment)
            .set({
                transactionId: transactionId.trim(),
                senderNumber: senderNumber.trim(),
                status: "pending", // Will be verified by admin
                updatedAt: new Date(),
            })
            .where(eq(payment.orderId, orderId));

        return {
            success: true,
            message: "Payment details submitted successfully. Awaiting admin verification."
        };
    } catch (error) {
        console.error("Error submitting manual payment:", error);
        return {
            success: false,
            error: "Failed to submit payment details. Please try again."
        };
    }
}
