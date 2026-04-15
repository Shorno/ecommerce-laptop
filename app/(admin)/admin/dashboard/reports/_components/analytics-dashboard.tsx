"use client"

import {useQuery} from "@tanstack/react-query"
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Area, AreaChart, ComposedChart, Line,
} from "recharts"
import {
    DollarSign, ShoppingCart, Users, Package,
    TrendingUp, Star, ArrowUpRight,
} from "lucide-react"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from "@/components/ui/chart"
import {Skeleton} from "@/components/ui/skeleton"
import {getAnalyticsData, type AnalyticsData} from "../actions/get-analytics"
import {formatPrice} from "@/utils/currency"

const COLORS = [
    "hsl(210, 100%, 56%)",
    "hsl(160, 70%, 45%)",
    "hsl(340, 75%, 55%)",
    "hsl(45, 95%, 50%)",
    "hsl(270, 60%, 55%)",
    "hsl(190, 80%, 45%)",
    "hsl(15, 85%, 55%)",
    "hsl(120, 50%, 45%)",
]

const STATUS_COLORS: Record<string, string> = {
    pending: "hsl(45, 95%, 50%)",
    confirmed: "hsl(200, 80%, 50%)",
    processing: "hsl(210, 100%, 56%)",
    shipped: "hsl(270, 60%, 55%)",
    delivered: "hsl(160, 70%, 45%)",
    cancelled: "hsl(0, 70%, 55%)",
    refunded: "hsl(0, 0%, 60%)",
}

// ─── KPI Card ───
function KpiCard({title, value, icon: Icon, subtitle, color}: {
    title: string
    value: string
    icon: React.ElementType
    subtitle?: string
    color: string
}) {
    return (
        <Card className="py-0">
            <CardContent className="flex items-center gap-3 p-4">
                <div className={`p-2 rounded-md ${color}`}>
                    <Icon className="h-4 w-4"/>
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">{title}</p>
                    <p className="text-lg font-bold leading-tight">{value}</p>
                    {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Compact Section Header ───
function SectionTitle({children}: { children: React.ReactNode }) {
    return <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{children}</h3>
}

// ─── Revenue Chart ───
function RevenueChart({data}: { data: AnalyticsData["revenueByMonth"] }) {
    const chartConfig = {
        revenue: {label: "Revenue", color: "hsl(210, 100%, 56%)"},
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-500"/>
                    Revenue Trend
                    <span className="text-xs font-normal text-muted-foreground ml-1">12 months</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No revenue data yet.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[180px] w-full">
                        <AreaChart data={data} margin={{top: 4, right: 4, left: -10, bottom: 0}}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3}/>
                            <XAxis dataKey="month" tick={{fontSize: 10}} tickLine={false} axisLine={false}/>
                            <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false}
                                   tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}/>
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                            <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)"
                                  fill="url(#revenueGrad)" strokeWidth={1.5}/>
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Daily Orders Chart ───
function DailyOrdersChart({data}: { data: AnalyticsData["dailyOrders"] }) {
    const chartConfig = {
        orders: {label: "Orders", color: "hsl(160, 70%, 45%)"},
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    Daily Orders
                    <span className="text-xs font-normal text-muted-foreground ml-1">30 days</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No orders in the last 30 days.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[180px] w-full">
                        <BarChart data={data} margin={{top: 4, right: 4, left: -10, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3}/>
                            <XAxis dataKey="date" tick={{fontSize: 9}} tickLine={false} axisLine={false}/>
                            <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false}/>
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                            <Bar dataKey="orders" fill="var(--color-orders)" radius={[2, 2, 0, 0]}/>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Category Donut ───
function CategoryDonut({data}: { data: AnalyticsData["salesByCategory"] }) {
    const chartConfig: ChartConfig = {}
    data.forEach((d, i) => {
        chartConfig[d.name] = {label: d.name, color: COLORS[i % COLORS.length]}
    })

    const total = data.reduce((s, d) => s + d.revenue, 0)

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No data.</p>
                ) : (
                    <div className="flex items-center gap-4">
                        <ChartContainer config={chartConfig} className="h-[140px] w-[140px] shrink-0">
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                                     paddingAngle={2} dataKey="revenue" nameKey="name" strokeWidth={0}>
                                    {data.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                            </PieChart>
                        </ChartContainer>
                        <div className="flex-1 space-y-1.5 min-w-0">
                            {data.slice(0, 5).map((d, i) => (
                                <div key={d.name} className="flex items-center gap-2 text-xs">
                                    <div className="h-2 w-2 rounded-full shrink-0"
                                         style={{backgroundColor: COLORS[i % COLORS.length]}}/>
                                    <span className="truncate flex-1 text-muted-foreground">{d.name}</span>
                                    <span className="font-medium tabular-nums">
                                        {total > 0 ? ((d.revenue / total) * 100).toFixed(0) : 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Brand Bar ───
function BrandBar({data}: { data: AnalyticsData["salesByBrand"] }) {
    const chartConfig = {
        revenue: {label: "Revenue", color: "hsl(270, 60%, 55%)"},
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold">Sales by Brand</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No data.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[140px] w-full">
                        <BarChart data={data.slice(0, 6)} layout="vertical"
                                  margin={{top: 0, right: 4, left: 0, bottom: 0}}>
                            <XAxis type="number" hide/>
                            <YAxis type="category" dataKey="name" tick={{fontSize: 11}} tickLine={false}
                                   axisLine={false} width={80}/>
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 3, 3, 0]} barSize={14}/>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Top Products ───
function TopProducts({data}: { data: AnalyticsData["topProducts"] }) {
    const maxSold = data[0]?.totalSold || 1
    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-purple-500"/>
                    Top Products
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">No sales yet.</p>
                ) : (
                    <div className="space-y-2">
                        {data.slice(0, 8).map((p, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground/60 w-4 text-right shrink-0">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                                        <span className="text-xs font-medium truncate">{p.name}</span>
                                        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{p.totalSold} sold</span>
                                    </div>
                                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary/70 rounded-full transition-all"
                                             style={{width: `${(p.totalSold / maxSold) * 100}%`}}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Customer Growth ───
function CustomerGrowth({data}: { data: AnalyticsData["customerGrowth"] }) {
    const chartConfig = {
        newCustomers: {label: "New", color: "hsl(45, 95%, 50%)"},
        cumulativeTotal: {label: "Total", color: "hsl(210, 100%, 56%)"},
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-yellow-500"/>
                    Customer Growth
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No data.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[160px] w-full">
                        <ComposedChart data={data} margin={{top: 4, right: 4, left: -10, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3}/>
                            <XAxis dataKey="month" tick={{fontSize: 10}} tickLine={false} axisLine={false}/>
                            <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false}/>
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                            <Bar dataKey="newCustomers" fill="var(--color-newCustomers)" radius={[2, 2, 0, 0]}
                                 barSize={12}/>
                            <Line type="monotone" dataKey="cumulativeTotal" stroke="var(--color-cumulativeTotal)"
                                  strokeWidth={1.5} dot={false}/>
                        </ComposedChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Order Status ───
function OrderStatus({data}: { data: AnalyticsData["orderStatusDistribution"] }) {
    const total = data.reduce((s, d) => s + d.count, 0)

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm font-semibold">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
                {data.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">No orders.</p>
                ) : (
                    <div className="space-y-2">
                        {data.map(d => {
                            const pct = total > 0 ? (d.count / total) * 100 : 0
                            return (
                                <div key={d.status} className="space-y-0.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full shrink-0"
                                                 style={{backgroundColor: STATUS_COLORS[d.status] ?? "hsl(200,20%,50%)"}}/>
                                            <span className="capitalize text-muted-foreground">{d.status}</span>
                                        </div>
                                        <span className="font-medium tabular-nums">{d.count} <span className="text-muted-foreground font-normal">({pct.toFixed(0)}%)</span></span>
                                    </div>
                                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all"
                                             style={{width: `${pct}%`, backgroundColor: STATUS_COLORS[d.status] ?? "hsl(200,20%,50%)"}}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ─── Loading ───
function AnalyticsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {Array.from({length: 6}).map((_, i) => (
                    <Skeleton key={i} className="h-[72px] rounded-lg"/>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Skeleton className="h-[230px] rounded-lg"/>
                <Skeleton className="h-[230px] rounded-lg"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Skeleton className="h-[200px] rounded-lg"/>
                <Skeleton className="h-[200px] rounded-lg"/>
                <Skeleton className="h-[200px] rounded-lg"/>
            </div>
        </div>
    )
}

// ─── Main ───
export default function AnalyticsDashboard() {
    const {data, isLoading} = useQuery({
        queryKey: ["admin-analytics"],
        queryFn: getAnalyticsData,
    })

    if (isLoading || !data) return <AnalyticsSkeleton/>

    const k = data.kpis

    return (
        <div className="space-y-4">
            {/* KPIs — 6 across */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <KpiCard title="Revenue" value={formatPrice(k.totalRevenue.toString())} icon={DollarSign}
                         color="bg-blue-500/10 text-blue-600" subtitle="Excl. cancelled"/>
                <KpiCard title="Orders" value={k.totalOrders.toLocaleString()} icon={ShoppingCart}
                         color="bg-green-500/10 text-green-600"/>
                <KpiCard title="Customers" value={k.totalCustomers.toLocaleString()} icon={Users}
                         color="bg-yellow-500/10 text-yellow-600"/>
                <KpiCard title="AOV" value={formatPrice(k.avgOrderValue.toFixed(0))} icon={ArrowUpRight}
                         color="bg-purple-500/10 text-purple-600"/>
                <KpiCard title="Products" value={k.totalProducts.toLocaleString()} icon={Package}
                         color="bg-indigo-500/10 text-indigo-600"/>
                <KpiCard title="Reviews" value={k.totalReviews.toLocaleString()} icon={Star}
                         color="bg-pink-500/10 text-pink-600"/>
            </div>

            {/* Charts Row 1: Revenue + Daily */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <RevenueChart data={data.revenueByMonth}/>
                <DailyOrdersChart data={data.dailyOrders}/>
            </div>

            {/* Charts Row 2: Category + Brand + Order Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <CategoryDonut data={data.salesByCategory}/>
                <BrandBar data={data.salesByBrand}/>
                <OrderStatus data={data.orderStatusDistribution}/>
            </div>

            {/* Charts Row 3: Top Products + Customer Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TopProducts data={data.topProducts}/>
                <CustomerGrowth data={data.customerGrowth}/>
            </div>
        </div>
    )
}
