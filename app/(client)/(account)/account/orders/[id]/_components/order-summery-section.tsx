import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/utils/currency"
import { OrderData } from "@/lib/types/order"

interface OrderSummarySectionProps {
    order: OrderData
}

export default function OrderSummarySection({ order }: OrderSummarySectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatPrice(parseFloat(order.subtotal))}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                            {parseFloat(order.shippingAmount) === 0
                                ? "FREE"
                                : formatPrice(parseFloat(order.shippingAmount))}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-base sm:text-lg">Total</span>
                        <span className="text-lg sm:text-xl font-bold text-primary">
                            {formatPrice(parseFloat(order.totalAmount))}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
