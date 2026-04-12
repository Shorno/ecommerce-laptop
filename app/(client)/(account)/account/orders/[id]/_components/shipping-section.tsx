import { MapPin } from "lucide-react"
import { OrderData } from "@/lib/types/order"

interface ShippingSectionProps {
    order: OrderData
}

export default function ShippingSection({ order }: ShippingSectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Shipping Address
                </h2>
            </div>
            <div className="p-4 sm:px-6 sm:py-5">
                <address className="text-sm not-italic space-y-1">
                    <p className="font-medium text-foreground">{order.customerFullName}</p>
                    <p className="text-muted-foreground break-words">{order.shippingAddressLine}</p>
                    <p className="text-muted-foreground">
                        {order.shippingArea && `${order.shippingArea}, `}
                        {order.shippingCity}
                    </p>
                    <p className="text-muted-foreground">
                        {order.shippingPostalCode}, {order.shippingCountry}
                    </p>
                </address>
            </div>
        </div>
    )
}
