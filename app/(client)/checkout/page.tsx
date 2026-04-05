"use client"

import {useTransition} from "react"
import {useRouter} from "next/navigation"
import ShippingForm from "@/app/(client)/checkout/_components/shipping-form"
import CartReview from "@/app/(client)/checkout/_components/cart-review"
import {useCartItems, useCartActions} from "@/stote/cart-sotre"
import {ShippingFormData} from "@/lib/schemas/address.scheam"
import {createOrder} from "@/app/actions/order"
import {toast} from "sonner"
import {Card, CardContent} from "@/components/ui/card"
import {Spinner} from "@/components/ui/spinner"

export default function CheckoutPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const cartItems = useCartItems()
    const {clearCart} = useCartActions()

    const handleValidSubmit = async (shippingData: ShippingFormData) => {
        if (isPending) return

        startTransition(async () => {
            try {
                const orderData = {
                    shipping: shippingData,
                    items: cartItems,
                }

                const result = await createOrder(orderData)

                if (result.success && result.orderId) {
                    await clearCart(true)

                    toast.success("Order placed successfully!", {
                        description: `Order number: ${result.orderNumber}`,
                    })

                    if (shippingData.paymentType === "cod") {
                        router.push(`/checkout/confirm?orderId=${result.orderId}`)
                    } else {
                        router.push(`/checkout/payment?orderId=${result.orderId}`)
                    }
                } else {
                    toast.error("Failed to place order", {
                        description: result.error || "Please try again",
                    })
                }
            } catch (error) {
                console.error("Error creating order:", error)
                toast.error("An error occurred", {
                    description: "Please try again later",
                })
            }
        })
    }
    if (isPending) {
        return (
            <div className="min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-2">
                            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Spinner className="h-8 w-8 text-primary"/>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-semibold">Processing Your Order</h2>
                                    <p className="text-muted-foreground">
                                        Please wait while we create your order...
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <ShippingForm onValidSubmit={handleValidSubmit}/>
                    <CartReview isProcessing={isPending}/>
                </div>
            </div>
        </div>
    )
}
