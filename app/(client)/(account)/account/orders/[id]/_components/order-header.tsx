import { Badge } from "@/components/ui/badge"
import { OrderData, statusColors, OrderStatus } from "@/lib/types/order"
import CancelOrderButton from "@/app/(client)/(account)/account/orders/[id]/_components/cancel-order-button"
import { Calendar, Hash, Package } from "lucide-react"

interface OrderHeaderProps {
    order: OrderData
}

export default function OrderHeader({ order }: OrderHeaderProps) {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div>
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Order #{order.orderNumber}
                    </h1>
                    {/* Meta pills */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5" />
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Hash className="h-3.5 w-3.5" />
                            {order.orderNumber}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Badge
                        variant="outline"
                        className={`${statusColors[order.status as OrderStatus] || "bg-gray-100 text-gray-800"} text-sm px-3 py-1`}
                    >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <CancelOrderButton orderId={order.id} orderStatus={order.status} />
                </div>
            </div>
        </div>
    )
}
