import { User, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderData } from "@/lib/types/order"

interface CustomerInfoSectionProps {
    order: OrderData
}

export default function CustomerInfoSection({ order }: CustomerInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    Customer Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm font-medium break-all">
                        {order.customerFullName}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm break-all">
                        {order.customerEmail}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm">
                        {order.customerPhone}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
