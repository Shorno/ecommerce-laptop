"use server"

import {db} from "@/db/config";
import {order, payment, PaymentWithOrder} from "@/db/schema";
import {and, desc, eq, isNotNull} from "drizzle-orm";
import {checkAuth} from "@/app/actions/auth/checkAuth";

interface VerifyManualPaymentData {
    paymentId: number;
    approve: boolean;
    rejectionReason?: string;
}

interface VerifyManualPaymentResponse {
    success: boolean;
    message?: string;
    error?: string;
}


export async function verifyManualPayment(data: VerifyManualPaymentData): Promise<VerifyManualPaymentResponse> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                success: false,
                error: "You must be logged in"
            };
        }

        // TODO: Add admin role check here
        if (session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized access"
            };
        }

        const {paymentId, approve} = data;

        // Get payment details
        const [paymentData] = await db
            .select()
            .from(payment)
            .where(eq(payment.id, paymentId))
            .limit(1);

        if (!paymentData) {
            return {
                success: false,
                error: "Payment not found"
            };
        }

        if (paymentData.status === "completed") {
            return {
                success: false,
                error: "Payment already verified"
            };
        }

        // Update payment status
        if (approve) {
            await db.transaction(async (tx) => {
                // Update payment status to completed
                await tx
                    .update(payment)
                    .set({
                        status: "completed",
                        completedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(eq(payment.id, paymentId));

                // Update order status to confirmed
                await tx
                    .update(order)
                    .set({
                        status: "confirmed",
                        confirmedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(eq(order.id, paymentData.orderId));
            });

            return {
                success: true,
                message: "Payment verified and order confirmed successfully"
            };
        } else {
            // Reject payment
            await db
                .update(payment)
                .set({
                    status: "failed",
                    failedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(payment.id, paymentId));

            return {
                success: true,
                message: "Payment rejected successfully"
            };
        }
    } catch (error) {
        console.error("Error verifying manual payment:", error);
        return {
            success: false,
            error: "Failed to verify payment. Please try again."
        };
    }
}

export async function getPendingPayments(): Promise<PaymentWithOrder[]> {
    return await db.query.payment.findMany({
        where: and(
            eq(payment.status, "pending"),
            isNotNull(payment.transactionId),
            isNotNull(payment.senderNumber)
        ),
        with: {
            order: true,
        },
        orderBy: desc(payment.createdAt),
    });
}
