"use client"

import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import {
    ShoppingBag,
    User,
    Lock,
    Package,
    ArrowRight,
    MapPin,
    Mail,
    Clock,
    ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { getCustomerOrders, type CustomerOrder } from "@/app/(client)/(account)/actions/customer-orders"
import { getCustomerInfo } from "@/app/(client)/(account)/actions/customer-info"
import { formatPrice } from "@/utils/currency"

const statusVariants = {
    pending: "secondary",
    confirmed: "default",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline",
} as const

const quickActions = [
    {
        title: "My Orders",
        description: "Track, return, or buy again",
        href: "/account/orders",
        icon: ShoppingBag,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
        title: "Personal Info",
        description: "Name, email & shipping address",
        href: "/account/profile",
        icon: User,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        title: "Change Password",
        description: "Update your security credentials",
        href: "/account/password-change",
        icon: Lock,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
        title: "Continue Shopping",
        description: "Browse our latest products",
        href: "/",
        icon: Package,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
]

export default function AccountOverview() {
    const { data: session } = authClient.useSession()

    const { data: orders, isPending: ordersLoading } = useQuery({
        queryKey: ["customerOrders"],
        queryFn: getCustomerOrders,
        enabled: !!session?.user?.id,
    })

    const { data: customerInfo, isPending: infoLoading } = useQuery({
        queryKey: ["customerInfo"],
        queryFn: getCustomerInfo,
        enabled: !!session?.user?.id,
    })

    const user = session?.user
    const recentOrders = orders?.slice(0, 3) || []
    const totalOrders = orders?.length || 0

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here&apos;s a summary of your account activity.
                </p>
            </div>

            {/* Quick actions grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                    >
                        <div className={`flex items-center justify-center h-11 w-11 rounded-lg ${action.color} shrink-0`}>
                            <action.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {action.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {action.description}
                            </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                ))}
            </div>

            {/* Account info snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Email */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted shrink-0">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Email</p>
                        <p className="text-sm text-foreground truncate">{user?.email || "—"}</p>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted shrink-0">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Address</p>
                        {infoLoading ? (
                            <Skeleton className="h-4 w-32 mt-0.5" />
                        ) : (
                            <p className="text-sm text-foreground truncate">
                                {customerInfo
                                    ? `${customerInfo.city}${customerInfo.area ? `, ${customerInfo.area}` : ""}`
                                    : "Not set"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Total orders */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted shrink-0">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Total Orders</p>
                        {ordersLoading ? (
                            <Skeleton className="h-4 w-8 mt-0.5" />
                        ) : (
                            <p className="text-sm text-foreground">{totalOrders}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
                    {totalOrders > 3 && (
                        <Link
                            href="/account/orders"
                            className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                        >
                            View all
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    )}
                </div>

                {ordersLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border animate-pulse">
                                <Skeleton className="h-14 w-14 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-border">
                        <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">No orders yet</p>
                        <p className="text-xs text-muted-foreground/70 mb-4">Your order history will appear here</p>
                        <Link
                            href="/"
                            className="text-sm text-primary font-medium hover:underline"
                        >
                            Start Shopping →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentOrders.map((order) => (
                            <RecentOrderRow key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function RecentOrderRow({ order }: { order: CustomerOrder }) {
    const firstItem = order.items[0]
    const extraCount = order.items.length - 1

    return (
        <Link
            href={`/account/orders/${order.id}`}
            className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200"
        >
            {/* Product thumbnail */}
            <div className="relative h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
                {firstItem?.productImage ? (
                    <Image
                        src={firstItem.productImage}
                        alt={firstItem.productName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                )}
            </div>

            {/* Order info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                        Order #{order.orderNumber}
                    </p>
                    <Badge
                        variant={statusVariants[order.status as keyof typeof statusVariants] || "secondary"}
                        className="text-[10px] px-1.5 py-0"
                    >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {firstItem?.productName || "Order"}
                    {extraCount > 0 && ` +${extraCount} more`}
                    {" · "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>

            {/* Total */}
            <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">
                    {formatPrice(parseFloat(order.totalAmount))}
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
        </Link>
    )
}
