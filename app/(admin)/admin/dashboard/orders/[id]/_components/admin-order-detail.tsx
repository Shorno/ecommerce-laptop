"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Home,
    Loader,
    MapPin,
    Package,
    Phone,
    Mail,
    Truck,
    User,
    XCircle,
    Hash,
    AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { formatPrice } from "@/utils/currency"
import { getAdminOrderDetail } from "@/app/(admin)/admin/dashboard/orders/actions/get-order-detail"
import { updateOrderStatus } from "@/app/(admin)/admin/dashboard/orders/actions/update-order-status"
import { getNextStatuses, getNextActionLabel } from "@/app/(admin)/admin/dashboard/orders/lib/order-transitions"
import type { OrderStatus } from "@/db/schema"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
}

const pipelineSteps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
] as const

const statusOrder: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
}

export default function AdminOrderDetail({ orderId }: { orderId: number }) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: order, isPending, error } = useQuery({
        queryKey: ["admin-order-detail", orderId],
        queryFn: () => getAdminOrderDetail(orderId),
    })

    const advanceMutation = useMutation({
        mutationFn: ({ status }: { status: OrderStatus }) =>
            updateOrderStatus(orderId, status),
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message)
                queryClient.invalidateQueries({ queryKey: ["admin-order-detail", orderId] })
                queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
                queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] })
            } else {
                toast.error(result.error)
            }
        },
        onError: () => {
            toast.error("Failed to update order status")
        },
    })

    if (isPending) return <DetailSkeleton />
    if (!order) return notFound()

    const currentStatus = order.status as OrderStatus
    const nextStatuses = getNextStatuses(currentStatus)
    const primaryActionLabel = getNextActionLabel(currentStatus)
    const isCancelled = currentStatus === "cancelled"
    const isDelivered = currentStatus === "delivered"
    const isRefunded = currentStatus === "refunded"
    const isTerminal = isCancelled || isDelivered || isRefunded
    const canCancel = nextStatuses.includes("cancelled")
    const primaryNext = nextStatuses.find(s => s !== "cancelled")
    const currentStepIndex = statusOrder[currentStatus] ?? -1
    const itemCount = order.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2 text-muted-foreground">
                    <Link href="/admin/dashboard/orders">
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to Orders
                    </Link>
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Order #{order.orderNumber}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "long", day: "numeric", year: "numeric",
                                    hour: "2-digit", minute: "2-digit",
                                })}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5" />
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5" />
                                COD
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Badge
                            variant="outline"
                            className={cn("text-sm px-3 py-1 border-0", statusColors[currentStatus])}
                        >
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Pipeline + Actions */}
            {isCancelled || isRefunded ? (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-destructive/10 shrink-0">
                        <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <p className="font-semibold text-destructive text-sm">
                            {isCancelled ? "Order Cancelled" : "Order Refunded"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {order.cancelledAt
                                ? `On ${new Date(order.cancelledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                                : "This order has been finalized."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-5">
                    {/* Horizontal stepper */}
                    <div className="hidden sm:flex items-start">
                        {pipelineSteps.map((step, index) => {
                            const StepIcon = step.icon
                            const isCompleted = index < currentStepIndex
                            const isCurrent = index === currentStepIndex
                            const isUpcoming = index > currentStepIndex
                            const isLast = index === pipelineSteps.length - 1

                            const tsMap: Record<string, Date | null> = {
                                confirmed: order.confirmedAt,
                                shipped: order.shippedAt,
                                delivered: order.deliveredAt,
                            }
                            const timestamp = tsMap[step.key]

                            return (
                                <div key={step.key} className="flex items-start flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "flex items-center justify-center h-10 w-10 rounded-full border-2 shrink-0 transition-all",
                                            isCurrent && "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20",
                                            isCompleted && "border-primary bg-primary/10 text-primary",
                                            isUpcoming && "border-muted-foreground/25 bg-muted text-muted-foreground/40",
                                        )}>
                                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-4 w-4" />}
                                        </div>
                                        <p className={cn(
                                            "text-xs font-medium mt-2 text-center whitespace-nowrap",
                                            isCurrent && "text-primary",
                                            isCompleted && "text-foreground",
                                            isUpcoming && "text-muted-foreground/50",
                                        )}>
                                            {step.label}
                                        </p>
                                        {timestamp && (
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </p>
                                        )}
                                    </div>
                                    {!isLast && (
                                        <div className="flex-1 mt-5 mx-2">
                                            <div className={cn(
                                                "h-0.5 w-full rounded-full transition-all",
                                                index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/15",
                                            )} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile stepper */}
                    <div className="sm:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {pipelineSteps.map((step, index) => {
                            const isCompleted = index < currentStepIndex
                            const isCurrent = index === currentStepIndex
                            const isUpcoming = index > currentStepIndex
                            const isLast = index === pipelineSteps.length - 1
                            return (
                                <div key={step.key} className="flex items-center shrink-0">
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                        isCurrent && "bg-primary text-primary-foreground",
                                        isCompleted && "bg-primary/10 text-primary",
                                        isUpcoming && "bg-muted text-muted-foreground/50",
                                    )}>
                                        {isCompleted && <CheckCircle className="h-3 w-3" />}
                                        {step.label}
                                    </div>
                                    {!isLast && (
                                        <div className={cn(
                                            "w-4 h-px mx-0.5",
                                            index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/15",
                                        )} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Action bar */}
                    {!isTerminal && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground flex-1">
                                {primaryActionLabel ? `Next step: ${primaryActionLabel}` : "No further actions available."}
                            </p>
                            <div className="flex items-center gap-2">
                                {canCancel && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                                                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                                Cancel Order
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                                    Cancel Order #{order.orderNumber}?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will cancel the order and restore any reserved stock. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={() => advanceMutation.mutate({ status: "cancelled" })}
                                                    disabled={advanceMutation.isPending}
                                                >
                                                    Yes, Cancel Order
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                {primaryNext && (
                                    <Button
                                        size="sm"
                                        onClick={() => advanceMutation.mutate({ status: primaryNext })}
                                        disabled={advanceMutation.isPending}
                                    >
                                        {advanceMutation.isPending && <Loader className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                                        {primaryActionLabel}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Items */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                    <h2 className="text-sm font-semibold text-foreground">Items Ordered ({order.items.length})</h2>
                </div>
                <div className="divide-y divide-border">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 p-4 sm:px-6 sm:py-5">
                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-muted overflow-hidden shrink-0">
                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground line-clamp-2 sm:line-clamp-1">{item.productName}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Variant: {item.variantLabel}</p>
                                <div className="flex items-center justify-between mt-2 sm:hidden">
                                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                    <p className="text-sm font-bold">{formatPrice(parseFloat(item.subtotal))}</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-start gap-8">
                                <div className="text-center">
                                    <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-semibold mb-1">Qty</p>
                                    <Badge variant="secondary">{item.quantity}</Badge>
                                </div>
                                <div className="text-center min-w-[80px]">
                                    <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-semibold mb-1">Price</p>
                                    <p className="text-sm">{formatPrice(parseFloat(item.unitPrice))}</p>
                                </div>
                                <div className="text-right min-w-[90px]">
                                    <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-semibold mb-1">Subtotal</p>
                                    <p className="text-sm font-bold">{formatPrice(parseFloat(item.subtotal))}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Order Summary */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                        <h2 className="text-sm font-semibold text-foreground">Order Summary</h2>
                    </div>
                    <div className="p-4 sm:px-6 sm:py-5 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">{formatPrice(parseFloat(order.subtotal))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="font-medium">
                                {parseFloat(order.shippingAmount) === 0 ? "FREE" : formatPrice(parseFloat(order.shippingAmount))}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-lg font-bold text-primary">{formatPrice(parseFloat(order.totalAmount))}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-border">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-medium">Cash on Delivery</span>
                        </div>
                    </div>
                </div>

                {/* Customer + Shipping */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" /> Customer
                            </h2>
                        </div>
                        <div className="p-4 sm:px-6 sm:py-5 space-y-2.5">
                            <div className="flex items-center gap-2.5">
                                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-sm font-medium truncate">{order.customerFullName}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-sm text-muted-foreground truncate">{order.customerEmail}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-sm text-muted-foreground">{order.customerPhone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" /> Shipping Address
                            </h2>
                        </div>
                        <div className="p-4 sm:px-6 sm:py-5">
                            <address className="text-sm not-italic space-y-1">
                                <p className="font-medium">{order.customerFullName}</p>
                                <p className="text-muted-foreground">{order.shippingAddressLine}</p>
                                <p className="text-muted-foreground">
                                    {order.shippingArea && `${order.shippingArea}, `}{order.shippingCity}
                                </p>
                                <p className="text-muted-foreground">
                                    {order.shippingPostalCode}, {order.shippingCountry}
                                </p>
                            </address>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timestamps log */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                    <h2 className="text-sm font-semibold text-foreground">Activity Log</h2>
                </div>
                <div className="p-4 sm:px-6 sm:py-5">
                    <div className="space-y-3">
                        {[
                            { label: "Order Placed", ts: order.createdAt },
                            { label: "Confirmed", ts: order.confirmedAt },
                            { label: "Shipped", ts: order.shippedAt },
                            { label: "Delivered", ts: order.deliveredAt },
                            { label: "Cancelled", ts: order.cancelledAt },
                        ]
                            .filter(e => e.ts)
                            .map(e => (
                                <div key={e.label} className="flex items-center justify-between text-sm">
                                    <span className="text-foreground font-medium">{e.label}</span>
                                    <span className="text-muted-foreground text-xs">
                                        {new Date(e.ts!).toLocaleString("en-US", {
                                            month: "short", day: "numeric", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── Skeleton ─── */
function DetailSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-8 w-64" />
                <div className="flex gap-4 mt-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-48 rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
