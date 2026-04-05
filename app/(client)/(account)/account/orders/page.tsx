import OrdersContent from "@/app/(client)/(account)/account/orders/_components/orders-content";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "My Orders",
    description: "View and track all your orders.",
};

export default function OrdersPage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <OrdersContent />
        </div>
    )
}
