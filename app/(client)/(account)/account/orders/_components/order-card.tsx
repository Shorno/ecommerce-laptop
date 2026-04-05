import Link from "next/link"
import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/utils/currency"
import OrderItemsPreview from "@/app/(client)/(account)/account/orders/_components/order-item-preview";
import { type CustomerOrder } from "@/app/(client)/(account)/actions/customer-orders"

interface OrderCardProps {
    order: CustomerOrder
}

const statusVariants = {
    pending: "secondary",
    confirmed: "default",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline",
} as const

export default function OrderCard({ order }: OrderCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <CardTitle className="text-base sm:text-lg">
                            Order #{order.orderNumber}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                        </p>
                    </div>
                    <Badge
                        variant={statusVariants[order.status as keyof typeof statusVariants] || "secondary"}
                        className="self-start sm:self-auto"
                    >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <OrderItemsPreview items={order.items} />

                    {/* Order Summary */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-lg sm:text-xl font-bold">
                                {formatPrice(parseFloat(order.totalAmount))}
                            </p>
                        </div>
                        <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link href={`/account/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
