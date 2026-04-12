"use client"

import { useQuery } from "@tanstack/react-query"
import {
    ShoppingBag,
    DollarSign,
    Package,
    Users,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    ArrowRight,
    TrendingUp,

    AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { getDashboardStats, type DashboardStats } from "@/app/(admin)/admin/dashboard/actions/get-dashboard-stats"
import { formatPrice } from "@/utils/currency"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
}

const revenueChartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--primary))",
    },
    orders: {
        label: "Orders",
        color: "hsl(var(--muted-foreground))",
    },
} satisfies ChartConfig

export default function AdminDashboardOverview() {
    const { data: stats, isPending } = useQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: getDashboardStats,
    })

    if (isPending || !stats) {
        return <DashboardSkeleton />
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Welcome back. Here&apos;s an overview of your store.
                </p>
            </div>

            {/* KPI cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    icon={DollarSign}
                    iconColor="bg-emerald-500/10 text-emerald-600"
                    subtitle="Excl. cancelled & refunded"
                />
                <KpiCard
                    title="Total Orders"
                    value={stats.totalOrders.toString()}
                    icon={ShoppingBag}
                    iconColor="bg-blue-500/10 text-blue-600"
                    subtitle={`${stats.pendingOrders} pending`}
                />
                <KpiCard
                    title="Products"
                    value={stats.totalProducts.toString()}
                    icon={Package}
                    iconColor="bg-amber-500/10 text-amber-600"
                    subtitle={`${stats.totalCategories} categories`}
                />
                <KpiCard
                    title="Customers"
                    value={stats.totalCustomers.toString()}
                    icon={Users}
                    iconColor="bg-purple-500/10 text-purple-600"
                    subtitle="Registered users"
                />
            </div>

            {/* Order status pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatusPill
                    label="Pending"
                    count={stats.pendingOrders}
                    icon={Clock}
                    color="text-yellow-600 bg-yellow-50 border-yellow-200"
                />
                <StatusPill
                    label="Processing"
                    count={stats.processingOrders}
                    icon={Truck}
                    color="text-purple-600 bg-purple-50 border-purple-200"
                />
                <StatusPill
                    label="Delivered"
                    count={stats.deliveredOrders}
                    icon={CheckCircle}
                    color="text-green-600 bg-green-50 border-green-200"
                />
                <StatusPill
                    label="Cancelled"
                    count={stats.cancelledOrders}
                    icon={XCircle}
                    color="text-red-600 bg-red-50 border-red-200"
                />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue chart — wide column */}
                <div className="lg:col-span-2">
                    <RevenueChart data={stats.revenueByMonth} />
                </div>

                {/* Top products — narrow column */}
                <TopProducts products={stats.topProducts} />
            </div>

            {/* Bottom row: Recent orders + Quick links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent orders — wide */}
                <div className="lg:col-span-2">
                    <RecentOrdersTable orders={stats.recentOrders} />
                </div>

                {/* Quick actions + alerts */}
                <div className="space-y-4">
                    <QuickActions pendingOrders={stats.pendingOrders} />
                </div>
            </div>
        </div>
    )
}

/* ─── Sub-components ─── */

function KpiCard({
    title,
    value,
    icon: Icon,
    iconColor,
    subtitle,
}: {
    title: string
    value: string
    icon: typeof DollarSign
    iconColor: string
    subtitle?: string
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className={cn("flex items-center justify-center h-9 w-9 rounded-lg", iconColor)}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
    )
}

function StatusPill({
    label,
    count,
    icon: Icon,
    color,
}: {
    label: string
    count: number
    icon: typeof Clock
    color: string
}) {
    return (
        <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", color)}>
            <Icon className="h-4 w-4 shrink-0" />
            <div>
                <p className="text-lg font-bold leading-tight">{count}</p>
                <p className="text-[11px] font-medium opacity-70">{label}</p>
            </div>
        </div>
    )
}

function RevenueChart({ data }: { data: DashboardStats["revenueByMonth"] }) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">Revenue Overview</h2>
                </div>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="p-4">
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                        No revenue data for this period
                    </div>
                ) : (
                    <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                        <BarChart data={data} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name) => {
                                            if (name === "revenue") return formatPrice(Number(value))
                                            return `${value} orders`
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </div>
    )
}

function TopProducts({ products }: { products: DashboardStats["topProducts"] }) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Top Products</h2>
                <p className="text-xs text-muted-foreground mt-0.5">By units sold</p>
            </div>
            <div className="divide-y divide-border">
                {products.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                        No product data yet
                    </div>
                ) : (
                    products.map((product, i) => (
                        <div key={product.name} className="flex items-center gap-3 px-5 py-3.5">
                            <span className="text-xs font-bold text-muted-foreground/50 w-5">
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {product.totalSold} sold · {formatPrice(product.revenue)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function RecentOrdersTable({ orders }: { orders: DashboardStats["recentOrders"] }) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
                <Link
                    href="/admin/dashboard/orders"
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                    View all <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
            {orders.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                    No orders yet
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left py-2.5 px-5 font-semibold text-muted-foreground text-xs">Order</th>
                                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground text-xs">Customer</th>
                                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground text-xs">Status</th>
                                <th className="text-right py-2.5 px-5 font-semibold text-muted-foreground text-xs">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3 px-5">
                                        <p className="font-medium text-foreground text-xs font-mono">
                                            #{order.orderNumber}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </td>
                                    <td className="py-3 px-3">
                                        <p className="text-foreground truncate max-w-[140px]">{order.customerFullName}</p>
                                    </td>
                                    <td className="py-3 px-3">
                                        <Badge
                                            variant="outline"
                                            className={cn("text-[10px] px-1.5 py-0 border-0", statusColors[order.status])}
                                        >
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-5 text-right font-semibold text-foreground">
                                        {formatPrice(parseFloat(order.totalAmount))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function QuickActions({ pendingOrders }: { pendingOrders: number }) {
    const alerts = [
        pendingOrders > 0 && {
            label: `${pendingOrders} pending order${pendingOrders > 1 ? "s" : ""} need attention`,
            href: "/admin/dashboard/orders",
            icon: AlertCircle,
            color: "text-yellow-600",
        },
    ].filter(Boolean) as { label: string; href: string; icon: typeof AlertCircle; color: string }[]

    const links = [
        { label: "Manage Orders", href: "/admin/dashboard/orders", icon: ShoppingBag },
        { label: "Manage Products", href: "/admin/dashboard/products", icon: Package },
        { label: "Categories", href: "/admin/dashboard/category", icon: Package },
        { label: "Featured Images", href: "/admin/dashboard/featured", icon: Package },
    ]

    return (
        <>
            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                        <h2 className="text-sm font-semibold text-foreground">Needs Attention</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {alerts.map((alert) => (
                            <Link
                                key={alert.href}
                                href={alert.href}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                            >
                                <alert.icon className={cn("h-4 w-4 shrink-0", alert.color)} />
                                <span className="text-sm text-foreground flex-1">{alert.label}</span>
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick links */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>
                </div>
                <div className="divide-y divide-border">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                        >
                            <link.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground flex-1">{link.label}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

/* ─── Loading skeleton ─── */

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>

            {/* KPI skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 w-9 rounded-lg" />
                        </div>
                        <div>
                            <Skeleton className="h-8 w-28" />
                            <Skeleton className="h-3 w-20 mt-1.5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Status pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
            </div>

            {/* Chart + products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-[340px] rounded-xl" />
                <Skeleton className="h-[340px] rounded-xl" />
            </div>

            {/* Orders table + quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-[300px] rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-[140px] rounded-xl" />
                    <Skeleton className="h-[200px] rounded-xl" />
                </div>
            </div>
        </div>
    )
}
