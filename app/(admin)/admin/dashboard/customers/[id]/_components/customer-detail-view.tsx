"use client"

import {useQuery} from "@tanstack/react-query"
import {getCustomerById, CustomerDetail} from "@/app/(admin)/admin/dashboard/customers/actions/get-customer-by-id"
import {
    ArrowLeft,
    Mail,
    Calendar,
    ShoppingBag,
    MapPin,
    Phone,
    ShieldCheck,
    User,
    Package,
    CreditCard,
    BadgeCheck,
    AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Skeleton} from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

function getInitials(name: string) {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

const statusVariants: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
    pending: "secondary",
    confirmed: "default",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline",
}

function CustomerDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
                    <Skeleton className="h-9 w-9 rounded-md"/>
                    <Skeleton className="h-5 w-40"/>
                </div>
            </header>
            <div className="p-4 lg:p-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <Skeleton className="h-64 w-full lg:w-80"/>
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Skeleton className="h-28"/>
                            <Skeleton className="h-28"/>
                            <Skeleton className="h-28"/>
                        </div>
                        <Skeleton className="h-64"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CustomerDetailView({customerId}: { customerId: string }) {
    const {data: customer, isLoading, error} = useQuery({
        queryKey: ["admin-customer", customerId],
        queryFn: () => getCustomerById(customerId),
    })

    if (isLoading) return <CustomerDetailSkeleton/>

    if (error || !customer) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto"/>
                    <h2 className="text-lg font-semibold">Customer Not Found</h2>
                    <p className="text-muted-foreground text-sm">
                        The customer you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/admin/dashboard/customers">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Customers
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const joinDate = new Date(customer.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const totalSpent = new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
    }).format(parseFloat(customer.totalSpent))

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header
                className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                            <Link href="/admin/dashboard/customers">
                                <ArrowLeft className="h-4 w-4"/>
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-sm sm:text-lg font-semibold truncate max-w-[200px] sm:max-w-none">
                                {customer.name}
                            </h1>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ── Left: Profile Card ── */}
                    <div className="w-full lg:w-80 shrink-0 space-y-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <Avatar className="h-20 w-20 ring-2 ring-primary/20 shadow-md">
                                        <AvatarImage src={customer.image || ""} alt={customer.name}/>
                                        <AvatarFallback
                                            className="text-lg font-semibold bg-primary/10 text-primary">
                                            {getInitials(customer.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-lg font-semibold">{customer.name}</h2>
                                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={customer.role === "admin" ? "default" : "secondary"}
                                            className="capitalize gap-1"
                                        >
                                            {customer.role === "admin"
                                                ? <ShieldCheck size={12}/>
                                                : <User size={12}/>
                                            }
                                            {customer.role}
                                        </Badge>
                                        {customer.emailVerified ? (
                                            <Badge variant="outline"
                                                   className="gap-1 text-green-600 border-green-200 bg-green-50">
                                                <BadgeCheck size={12}/>
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline"
                                                   className="gap-1 text-orange-600 border-orange-200 bg-orange-50">
                                                <AlertCircle size={12}/>
                                                Unverified
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-4"/>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2.5 text-muted-foreground">
                                        <Mail size={14} className="shrink-0"/>
                                        <span className="truncate">{customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-muted-foreground">
                                        <Calendar size={14} className="shrink-0"/>
                                        <span>Joined {joinDate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Saved Addresses */}
                        {customer.addresses.length > 0 && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <MapPin size={14}/>
                                        Saved Addresses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {customer.addresses.map((addr) => (
                                        <div key={addr.id}
                                             className="rounded-lg border p-3 space-y-1.5 text-sm">
                                            <p className="font-medium">{addr.fullName}</p>
                                            <p className="text-muted-foreground text-xs">{addr.addressLine}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {addr.area}, {addr.city} {addr.postalCode}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                                <Phone size={10}/>
                                                {addr.phone}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* ── Right: Stats + Orders ── */}
                    <div className="flex-1 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                            <ShoppingBag className="h-5 w-5 text-blue-500"/>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold tabular-nums">{customer.totalOrders}</p>
                                            <p className="text-xs text-muted-foreground">Total Orders</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                            <CreditCard className="h-5 w-5 text-green-500"/>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold tabular-nums">{totalSpent}</p>
                                            <p className="text-xs text-muted-foreground">Total Spent</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                                            <Package className="h-5 w-5 text-purple-500"/>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold tabular-nums">
                                                {customer.totalOrders > 0
                                                    ? new Intl.NumberFormat("en-BD", {
                                                        style: "currency",
                                                        currency: "BDT"
                                                    }).format(parseFloat(customer.totalSpent) / customer.totalOrders)
                                                    : "৳0"
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">Avg. Order Value</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order History Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Order History</CardTitle>
                                <CardDescription>
                                    All orders placed by this customer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {customer.orders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mb-3"/>
                                        <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">
                                            This customer hasn&apos;t placed any orders.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Order #</TableHead>
                                                    <TableHead className="text-center">Items</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                    <TableHead className="text-center">Amount</TableHead>
                                                    <TableHead className="text-center">Date</TableHead>
                                                    <TableHead className="text-center">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customer.orders.map((o) => (
                                                    <TableRow key={o.id}>
                                                        <TableCell>
                                                            <Link
                                                                href={`/admin/dashboard/orders/${o.id}`}
                                                                className="font-medium text-primary hover:underline text-sm"
                                                            >
                                                                {o.orderNumber}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="text-center text-sm">
                                                            {o.itemCount}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge
                                                                variant={statusVariants[o.status] || "secondary"}
                                                                className="capitalize text-[11px]"
                                                            >
                                                                {o.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center text-sm font-medium tabular-nums">
                                                            {new Intl.NumberFormat("en-BD", {
                                                                style: "currency",
                                                                currency: "BDT",
                                                            }).format(parseFloat(o.totalAmount))}
                                                        </TableCell>
                                                        <TableCell className="text-center text-sm">
                                                            {new Date(o.createdAt).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button variant="ghost" size="sm" asChild
                                                                    className="text-muted-foreground hover:text-primary">
                                                                <Link href={`/admin/dashboard/orders/${o.id}`}>
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
