import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderData } from "@/lib/types/order"

interface ShippingSectionProps {
    order: OrderData
}

export default function ShippingSection({ order }: ShippingSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shipping Address
                </CardTitle>
            </CardHeader>
            <CardContent>
                <address className="text-xs sm:text-sm not-italic space-y-1">
                    <p className="font-medium">{order.customerFullName}</p>
                    <p className="text-muted-foreground break-words">
                        {order.shippingAddressLine}
                    </p>
                    <p className="text-muted-foreground">
                        {order.shippingArea && `${order.shippingArea}, `}
                        {order.shippingCity}
                    </p>
                    <p className="text-muted-foreground">
                        {order.shippingPostalCode}, {order.shippingCountry}
                    </p>
                </address>
            </CardContent>
        </Card>
    )
}
