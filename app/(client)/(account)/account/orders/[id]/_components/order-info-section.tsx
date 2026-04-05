import { Calendar, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderData } from "@/lib/types/order"

interface OrderInfoSectionProps {
    order: OrderData
}

export default function OrderInfoSection({ order }: OrderInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Information</CardTitle>
                <CardDescription className="text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2 shrink-0">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground">Order Date</p>
                            <p className="font-medium text-sm sm:text-base">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2 shrink-0">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground">Total Items</p>
                            <p className="font-medium text-sm sm:text-base">
                                {order.items.length} items
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
