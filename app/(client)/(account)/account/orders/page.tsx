import OrdersContent from "@/app/(client)/(account)/account/orders/_components/orders-content";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "My Orders",
    description: "View and track all your orders.",
};

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Track, manage, and review your past orders.
                </p>
            </div>
            <OrdersContent />
        </div>
    )
}
