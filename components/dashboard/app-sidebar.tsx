"use client"

import * as React from "react"
import {NavMain} from "@/components/dashboard/nav-main"
import {NavUser} from "@/components/dashboard/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
    LayoutDashboardIcon,
    ListIcon,
    ShoppingBagIcon,
    SlidersIcon,
    WarehouseIcon,
    TagIcon,
    UsersIcon,
    BoxesIcon,
    StarIcon,
    BarChartIcon,
    SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import {authClient} from "@/lib/auth-client";
import UserNavSkeleton from "@/components/dashboard/user-nav-skeleton";

const navOverview = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Orders",
        url: "/admin/dashboard/orders",
        icon: ShoppingBagIcon,
    },
    {
        title: "Customers",
        url: "/admin/dashboard/customers",
        icon: UsersIcon,
    },
    {
        title: "Reviews",
        url: "/admin/dashboard/reviews",
        icon: StarIcon,
    },
    {
        title: "Reports",
        url: "/admin/dashboard/reports",
        icon: BarChartIcon,
    },
];

const navCatalog = [
    {
        title: "Products",
        url: "/admin/dashboard/products",
        icon: ListIcon,
    },
    {
        title: "Inventory",
        url: "/admin/dashboard/inventory",
        icon: BoxesIcon,
    },
    {
        title: "Category",
        url: "/admin/dashboard/category",
        icon: WarehouseIcon,
    },
    {
        title: "Brands",
        url: "/admin/dashboard/brands",
        icon: TagIcon,
    },
    {
        title: "Featured",
        url: "/admin/dashboard/featured",
        icon: SlidersIcon,
    },
];

const navSystem = [
    {
        title: "Settings",
        url: "/admin/dashboard/settings",
        icon: SettingsIcon,
    },
];

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data, isPending} = authClient.useSession()

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            {/* ── Brand Header ── */}
            <SidebarHeader className="px-5 pt-5 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-0 hover:bg-transparent active:bg-transparent"
                        >
                            <Link href="/" className="flex items-center gap-2.5">
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                    <span className="text-sm font-bold tracking-tight">LB</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold tracking-tight text-foreground">
                                        LaptopBD
                                    </span>
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        Admin Console
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator className="mx-4 opacity-60"/>

            {/* ── Navigation ── */}
            <SidebarContent className="px-2 pt-2">
                <SidebarGroupLabel className="px-3 mb-1 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                    Overview
                </SidebarGroupLabel>
                <NavMain items={navOverview}/>

                <SidebarSeparator className="mx-3 my-2 opacity-40"/>

                <SidebarGroupLabel className="px-3 mb-1 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                    Catalog
                </SidebarGroupLabel>
                <NavMain items={navCatalog}/>

                <SidebarSeparator className="mx-3 my-2 opacity-40"/>

                <SidebarGroupLabel className="px-3 mb-1 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                    System
                </SidebarGroupLabel>
                <NavMain items={navSystem}/>
            </SidebarContent>

            {/* ── User Footer ── */}
            <SidebarFooter className="border-t border-sidebar-border/60 p-3">
                {
                    isPending || !data ? <UserNavSkeleton/> : <NavUser session={data}/>
                }
            </SidebarFooter>
        </Sidebar>
    )
}
