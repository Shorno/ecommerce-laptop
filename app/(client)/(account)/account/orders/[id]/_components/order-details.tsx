import { OrderData } from "@/lib/types/order"
import OrderHeader from "@/app/(client)/(account)/account/orders/[id]/_components/order-header";
import OrderItemsSection from "@/app/(client)/(account)/account/orders/[id]/_components/order-item-section";
import OrderSummarySection from "@/app/(client)/(account)/account/orders/[id]/_components/order-summery-section";
import CustomerInfoSection from "@/app/(client)/(account)/account/orders/[id]/_components/customer-info-section";
import ShippingSection from "@/app/(client)/(account)/account/orders/[id]/_components/shipping-section";
import PaymentSection from "@/app/(client)/(account)/account/orders/[id]/_components/payment-section";
import OrderTimeline from "@/app/(client)/(account)/account/orders/[id]/_components/order-timeline";
import {getOrderById} from "@/app/actions/order";
import {notFound} from "next/navigation";




export default  async function OrderDetailContent({orderId }: {orderId: number}) {
    const order = await getOrderById(orderId) as OrderData | null

    if (!order) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <OrderHeader order={order} />

            {/* Status + Timeline banner */}
            <OrderTimeline order={order} />

            {/* Items — full width, the main content */}
            <OrderItemsSection items={order.items} />

            {/* Bottom grid: Summary + Details side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Order Summary + Payment */}
                <div className="space-y-4">
                    <OrderSummarySection order={order} />
                    <PaymentSection payment={order.payment} />
                </div>

                {/* Right: Customer + Shipping */}
                <div className="space-y-4">
                    <CustomerInfoSection order={order} />
                    <ShippingSection order={order} />
                </div>
            </div>
        </div>
    )
}
