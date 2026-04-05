import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { OrderData, statusColors, OrderStatus } from "@/lib/types/order"

interface OrderHeaderProps {
    order: OrderData
}

export default function OrderHeader({ order }: OrderHeaderProps) {
    return (
        <div className="mb-6 sm:mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-3 sm:mb-4">
                <Link href="/account/orders">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back to Orders</span>
                    <span className="sm:hidden">Back</span>
                </Link>
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Order Details</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Order #{order.orderNumber}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={`${statusColors[order.status as OrderStatus] || "bg-gray-100 text-gray-800"} text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 self-start sm:self-auto`}
                >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
            </div>
        </div>
    )
}
