import { Package, CheckCircle, Truck, Home, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderData } from "@/lib/types/order"

interface OrderTimelineProps {
    order: OrderData
}

const timelineSteps = [
    {
        key: "pending",
        label: "Order Placed",
        description: "Your order has been received",
        icon: Clock,
    },
    {
        key: "confirmed",
        label: "Confirmed",
        description: "Order has been confirmed",
        icon: CheckCircle,
    },
    {
        key: "processing",
        label: "Processing",
        description: "Your order is being prepared",
        icon: Package,
    },
    {
        key: "shipped",
        label: "Shipped",
        description: "Your order is on the way",
        icon: Truck,
    },
    {
        key: "delivered",
        label: "Delivered",
        description: "Order has been delivered",
        icon: Home,
    },
] as const

const statusOrder: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
    const isCancelled = order.status === "cancelled"
    const isRefunded = order.status === "refunded"
    const currentStepIndex = statusOrder[order.status] ?? -1

    if (isCancelled || isRefunded) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                        Order Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="rounded-full bg-destructive/20 p-2 shrink-0">
                            <XCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <p className="font-semibold text-destructive">
                                {isCancelled ? "Order Cancelled" : "Order Refunded"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {isCancelled
                                    ? "This order has been cancelled."
                                    : "This order has been refunded."}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    Order Progress
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {timelineSteps.map((step, index) => {
                        const StepIcon = step.icon
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex
                        const isLast = index === timelineSteps.length - 1

                        return (
                            <div key={step.key} className="flex gap-3 pb-6 last:pb-0">
                                {/* Vertical line + dot */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`
                                            flex items-center justify-center w-9 h-9 rounded-full border-2 shrink-0 transition-all
                                            ${isCurrent
                                            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                            : isCompleted
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-muted-foreground/30 bg-muted text-muted-foreground/50"
                                        }
                                        `}
                                    >
                                        <StepIcon className="h-4 w-4" />
                                    </div>
                                    {!isLast && (
                                        <div
                                            className={`
                                                w-0.5 flex-1 mt-1 min-h-[20px] transition-all
                                                ${index < currentStepIndex
                                                ? "bg-primary"
                                                : "bg-muted-foreground/20"
                                            }
                                            `}
                                        />
                                    )}
                                </div>

                                {/* Step content */}
                                <div className={`pt-1.5 ${isCurrent ? "" : ""}`}>
                                    <p
                                        className={`
                                            text-sm font-semibold leading-tight
                                            ${isCurrent
                                            ? "text-primary"
                                            : isCompleted
                                                ? "text-foreground"
                                                : "text-muted-foreground/60"
                                        }
                                        `}
                                    >
                                        {step.label}
                                    </p>
                                    <p
                                        className={`
                                            text-xs mt-0.5
                                            ${isCompleted || isCurrent
                                            ? "text-muted-foreground"
                                            : "text-muted-foreground/40"
                                        }
                                        `}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
