import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/utils/currency"
import { OrderData } from "@/lib/types/order"

interface OrderSummarySectionProps {
    order: OrderData
}

export default function OrderSummarySection({ order }: OrderSummarySectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground">Order Summary</h2>
            </div>
            <div className="p-4 sm:px-6 sm:py-5 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(parseFloat(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">
                        {parseFloat(order.shippingAmount) === 0
                            ? "FREE"
                            : formatPrice(parseFloat(order.shippingAmount))}
                    </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-primary">
                        {formatPrice(parseFloat(order.totalAmount))}
                    </span>
                </div>
            </div>
        </div>
    )
}
