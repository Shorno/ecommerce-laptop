import { Package, CheckCircle, Truck, Home, Clock, XCircle } from "lucide-react"
import { OrderData } from "@/lib/types/order"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
    order: OrderData
}

const timelineSteps = [
    {
        key: "pending",
        label: "Order Placed",
        icon: Clock,
    },
    {
        key: "confirmed",
        label: "Confirmed",
        icon: CheckCircle,
    },
    {
        key: "processing",
        label: "Processing",
        icon: Package,
    },
    {
        key: "shipped",
        label: "Shipped",
        icon: Truck,
    },
    {
        key: "delivered",
        label: "Delivered",
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

    // Cancelled / Refunded banner
    if (isCancelled || isRefunded) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-destructive/10 shrink-0">
                    <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                    <p className="font-semibold text-destructive text-sm">
                        {isCancelled ? "Order Cancelled" : "Order Refunded"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {isCancelled
                            ? `Cancelled on ${order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}`
                            : "This order has been refunded to your account."}
                    </p>
                </div>
            </div>
        )
    }

    // Horizontal stepper
    return (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            {/* Desktop: horizontal stepper */}
            <div className="hidden sm:block">
                <div className="flex items-start">
                    {timelineSteps.map((step, index) => {
                        const StepIcon = step.icon
                        const isCompleted = index < currentStepIndex
                        const isCurrent = index === currentStepIndex
                        const isUpcoming = index > currentStepIndex
                        const isLast = index === timelineSteps.length - 1

                        return (
                            <div key={step.key} className="flex items-start flex-1 last:flex-none">
                                {/* Step circle + label */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "flex items-center justify-center h-10 w-10 rounded-full border-2 shrink-0 transition-all",
                                            isCurrent && "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20",
                                            isCompleted && "border-primary bg-primary/10 text-primary",
                                            isUpcoming && "border-muted-foreground/25 bg-muted text-muted-foreground/40",
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <StepIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-xs font-medium mt-2 text-center whitespace-nowrap",
                                        isCurrent && "text-primary",
                                        isCompleted && "text-foreground",
                                        isUpcoming && "text-muted-foreground/50",
                                    )}>
                                        {step.label}
                                    </p>
                                </div>

                                {/* Connector line */}
                                {!isLast && (
                                    <div className="flex-1 mt-5 mx-2">
                                        <div
                                            className={cn(
                                                "h-0.5 w-full rounded-full transition-all",
                                                index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/15",
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Mobile: compact vertical list */}
            <div className="sm:hidden">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {timelineSteps.map((step, index) => {
                        const isCompleted = index < currentStepIndex
                        const isCurrent = index === currentStepIndex
                        const isUpcoming = index > currentStepIndex
                        const isLast = index === timelineSteps.length - 1

                        return (
                            <div key={step.key} className="flex items-center shrink-0">
                                <div
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                                        isCurrent && "bg-primary text-primary-foreground",
                                        isCompleted && "bg-primary/10 text-primary",
                                        isUpcoming && "bg-muted text-muted-foreground/50",
                                    )}
                                >
                                    {isCompleted && <CheckCircle className="h-3 w-3" />}
                                    {step.label}
                                </div>
                                {!isLast && (
                                    <div
                                        className={cn(
                                            "w-4 h-px mx-0.5",
                                            index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/15",
                                        )}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
