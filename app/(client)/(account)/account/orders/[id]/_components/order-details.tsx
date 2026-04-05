import { OrderData } from "@/lib/types/order"
import OrderHeader from "@/app/(client)/(account)/account/orders/[id]/_components/order-header";
import OrderInfoSection from "@/app/(client)/(account)/account/orders/[id]/_components/order-info-section";
import OrderItemsSection from "@/app/(client)/(account)/account/orders/[id]/_components/order-item-section";
import OrderSummarySection from "@/app/(client)/(account)/account/orders/[id]/_components/order-summery-section";
import CustomerInfoSection from "@/app/(client)/(account)/account/orders/[id]/_components/customer-info-section";
import ShippingSection from "@/app/(client)/(account)/account/orders/[id]/_components/shipping-section";
import {getOrderById} from "@/app/actions/order";
import {notFound} from "next/navigation";




export default  async function OrderDetailContent({orderId }: {orderId: number}) {
    const order = await getOrderById(orderId) as OrderData | null

    if (!order) {
        notFound()
    }

    return (
        <div className="container mx-auto">
            <OrderHeader order={order} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <OrderInfoSection order={order} />
                    <OrderItemsSection items={order.items} />
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                    <OrderSummarySection order={order} />
                    <CustomerInfoSection order={order} />
                    <ShippingSection order={order} />
                </div>
            </div>
        </div>
    )
}
