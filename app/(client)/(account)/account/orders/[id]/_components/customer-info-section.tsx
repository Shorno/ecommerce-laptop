import { User, Mail, Phone } from "lucide-react"
import { OrderData } from "@/lib/types/order"

interface CustomerInfoSectionProps {
    order: OrderData
}

export default function CustomerInfoSection({ order }: CustomerInfoSectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Customer
                </h2>
            </div>
            <div className="p-4 sm:px-6 sm:py-5 space-y-2.5">
                <div className="flex items-center gap-2.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">
                        {order.customerFullName}
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                        {order.customerEmail}
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">
                        {order.customerPhone}
                    </span>
                </div>
            </div>
        </div>
    )
}
