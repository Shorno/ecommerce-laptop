"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, Eye} from "lucide-react"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import type {CustomerListItem} from "../actions/get-customers"

function getInitials(name: string) {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export const customerColumns: ColumnDef<CustomerListItem>[] = [
    {
        accessorKey: "name",
        header: () => <div className="text-left">Customer</div>,
        cell: ({row}) => {
            const customer = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-1 ring-border">
                        <AvatarImage src={customer.image || ""} alt={customer.name}/>
                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                            {getInitials(customer.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link
                            href={`/admin/dashboard/customers/${customer.id}`}
                            className="font-medium text-sm hover:text-primary hover:underline transition-colors"
                        >
                            {customer.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "role",
        header: () => <div className="text-center">Role</div>,
        cell: ({row}) => {
            const role = row.getValue("role") as string
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={role === "admin" ? "default" : "secondary"}
                        className="capitalize text-[11px]"
                    >
                        {role}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "totalOrders",
        header: ({column}) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Orders
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => (
            <div className="text-center font-medium tabular-nums">{row.getValue("totalOrders")}</div>
        ),
    },
    {
        accessorKey: "totalSpent",
        header: ({column}) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total Spent
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("totalSpent"))
            const formatted = new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
            }).format(amount)
            return <div className="text-center font-medium tabular-nums">{formatted}</div>
        },
    },
    {
        accessorKey: "lastOrderDate",
        header: ({column}) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Last Order
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const date = row.getValue("lastOrderDate") as Date | null
            if (!date) return <div className="text-center text-sm text-muted-foreground">—</div>
            return (
                <div className="text-center text-sm">
                    {new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Joined
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div className="text-center text-sm">
                    {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        id: "details",
        header: () => <div className="text-center">Details</div>,
        enableHiding: false,
        cell: ({row}) => {
            const customer = row.original
            return (
                <div className="flex justify-center">
                    <Button variant="ghost" size="sm" asChild
                            className="gap-1.5 text-muted-foreground hover:text-primary">
                        <Link href={`/admin/dashboard/customers/${customer.id}`}>
                            <Eye className="h-4 w-4"/>
                            <span>View</span>
                        </Link>
                    </Button>
                </div>
            )
        },
    },
]
