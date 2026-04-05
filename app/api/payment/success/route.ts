import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const orderId = formData.get("value_a")

        if (!orderId) {
            const failUrl = new URL("/checkout/payment/failed", request.url)
            failUrl.searchParams.set("reason", "missing_order_id")
            return NextResponse.redirect(failUrl, 303)
        }

        const successUrl = new URL("/checkout/payment/success", request.url)
        successUrl.searchParams.set("orderId", orderId as string)

        return NextResponse.redirect(successUrl, 303)
    } catch (error) {
        console.error("Success callback error:", error)
        const failUrl = new URL("/checkout/payment/failed", request.url)
        failUrl.searchParams.set("reason", "processing_error")
        return NextResponse.redirect(failUrl, 303)
    }
}