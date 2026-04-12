import { CreditCard, Banknote, CheckCircle, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { OrderPaymentData } from "@/lib/types/order"

interface PaymentSectionProps {
    payment: OrderPaymentData | null
}

const paymentStatusConfig = {
    pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
    processing: { label: "Processing", icon: Clock, variant: "secondary" as const },
    completed: { label: "Paid", icon: CheckCircle, variant: "default" as const },
    failed: { label: "Failed", icon: XCircle, variant: "destructive" as const },
    refunded: { label: "Refunded", icon: XCircle, variant: "outline" as const },
    partially_refunded: { label: "Partially Refunded", icon: XCircle, variant: "outline" as const },
    cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
} as const

function getPaymentMethodLabel(method: string): string {
    switch (method) {
        case "cod": return "Cash on Delivery"
        case "bkash": return "bKash"
        case "nagad": return "Nagad"
        case "rocket": return "Rocket"
        default: return method.charAt(0).toUpperCase() + method.slice(1)
    }
}

function getPaymentMethodDescription(method: string): string {
    switch (method) {
        case "cod": return "Payment will be collected upon delivery"
        case "bkash":
        case "nagad":
        case "rocket":
            return "Mobile banking payment"
        default:
            return "Online payment"
    }
}

export default function PaymentSection({ payment }: PaymentSectionProps) {
    const isCod = !payment || payment.paymentMethod === "cod"
    const statusKey = (payment?.status || "pending") as keyof typeof paymentStatusConfig
    const statusInfo = paymentStatusConfig[statusKey] || paymentStatusConfig.pending
    const StatusIcon = statusInfo.icon

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {isCod ? (
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    )}
                    Payment
                </h2>
            </div>
            <div className="p-4 sm:px-6 sm:py-5 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                        {getPaymentMethodLabel(payment?.paymentMethod || "cod")}
                    </p>
                    <Badge variant={statusInfo.variant} className="gap-1 text-xs">
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                    {getPaymentMethodDescription(payment?.paymentMethod || "cod")}
                </p>
                {payment?.transactionId && (
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                        <span className="font-medium">Transaction ID:</span>{" "}
                        <span className="font-mono">{payment.transactionId}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
