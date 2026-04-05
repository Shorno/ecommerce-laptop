import {NextRequest, NextResponse} from "next/server"
import {db} from "@/db/config"
import {order, payment} from "@/db/schema"
import {eq} from "drizzle-orm"

export async function POST(request: NextRequest) {
    try {
        const body = await request.formData()

        const status = body.get("status") as string
        const tranId = body.get("tran_id") as string
        const orderId = parseInt(body.get("value_a") as string)
        // const valId = body.get("val_id") as string
        const cardIssuer = body.get("card_issuer") as string


        if (status === "VALID" || status === "VALIDATED") {
            await db.transaction(async (tx) => {
                await tx
                    .update(order)
                    .set({
                        status: "confirmed",
                        confirmedAt: new Date(),
                    })
                    .where(eq(order.id, orderId))

                await tx
                    .update(payment)
                    .set({
                        transactionId: tranId,
                        paymentMethod: cardIssuer,
                        status: "completed",
                        completedAt: new Date(),
                        paymentProvider: "sslcommerz",
                    })
                    .where(eq(payment.orderId, orderId))
            })

            return NextResponse.json({success: true, message: "Payment confirmed"})
        } else if (status === "FAILED") {
            await db
                .update(payment)
                .set({
                    status: "failed",
                    failedAt: new Date(),
                })
                .where(eq(payment.orderId, orderId))

            return NextResponse.json({success: false, message: "Payment failed"})
        }

        return NextResponse.json({success: false, message: "Unknown status"})
    } catch (error) {
        console.error("IPN Error:", error)
        return NextResponse.json(
            {success: false, error: "Internal server error"},
            {status: 500}
        )
    }
}
