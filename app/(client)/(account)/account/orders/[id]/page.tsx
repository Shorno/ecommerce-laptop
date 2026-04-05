import { notFound } from "next/navigation"
import OrderDetailContent from "@/app/(client)/(account)/account/orders/[id]/_components/order-details";
import {Suspense} from "react";
import OrderDetailLoading from "@/app/(client)/(account)/account/orders/[id]/_components/order-details-skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Order Details",
    description: "View detailed information about your order.",
};

interface OrderDetailPageProps {
    params: Promise<{id: string}>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const {id} = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
        notFound()
    }


    return  (
        <Suspense fallback={<OrderDetailLoading/>}>
            <OrderDetailContent orderId={orderId} />
        </Suspense>
    )
}
