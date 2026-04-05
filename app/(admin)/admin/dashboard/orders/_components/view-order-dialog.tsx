"use client"

import * as React from "react"
import { Eye } from "lucide-react"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderWithDetails } from "./order-columns"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface ViewOrderDialogProps {
    order: OrderWithDetails
}

export default function ViewOrderDialog({ order }: ViewOrderDialogProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order #{order.orderNumber}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Order Status</p>
                            <Badge className="mt-1">{order.status}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <Badge className="mt-1">{order.payment?.status || "N/A"}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-sm font-medium mt-1">
                                {new Date(order.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Name</p>
                                <p className="font-medium">{order.customerFullName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div>
                        <h3 className="font-semibold mb-3">Shipping Address</h3>
                        <div className="text-sm">
                            <p>{order.shippingAddressLine}</p>
                            {order.shippingArea && <p>{order.shippingArea}</p>}
                            <p>{order.shippingCity} - {order.shippingPostalCode}</p>
                            <p>{order.shippingCountry}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-3">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Size: {item.productSize}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {new Intl.NumberFormat("en-BD", {
                                                style: "currency",
                                                currency: "BDT",
                                            }).format(parseFloat(item.totalAmount))}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            @ {new Intl.NumberFormat("en-BD", {
                                                style: "currency",
                                                currency: "BDT",
                                            }).format(parseFloat(item.unitPrice))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div>
                        <h3 className="font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p className="font-medium">
                                    {new Intl.NumberFormat("en-BD", {
                                        style: "currency",
                                        currency: "BDT",
                                    }).format(parseFloat(order.subtotal))}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Shipping</p>
                                <p className="font-medium">
                                    {new Intl.NumberFormat("en-BD", {
                                        style: "currency",
                                        currency: "BDT",
                                    }).format(parseFloat(order.shippingAmount))}
                                </p>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-base">
                                <p className="font-semibold">Total</p>
                                <p className="font-semibold">
                                    {new Intl.NumberFormat("en-BD", {
                                        style: "currency",
                                        currency: "BDT",
                                    }).format(parseFloat(order.totalAmount))}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    {order.payment && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Payment Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Payment Method</p>
                                        <p className="font-medium">{order.payment.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Transaction ID</p>
                                        <p className="font-medium">{order.payment.transactionId || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

