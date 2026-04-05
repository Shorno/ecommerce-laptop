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
} from "@/components/ui/sidebar"
import {ListIcon, ShoppingBagIcon, SlidersIcon, TimerIcon, WarehouseIcon} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {authClient} from "@/lib/auth-client";
import UserNavSkeleton from "@/components/dashboard/user-nav-skeleton";

const navLinks = {
    navMain: [

        {
            title: "Orders",
            url: "/admin/dashboard/orders",
            icon: ShoppingBagIcon,
        },
        {
            title: "Payments",
            url: "/admin/dashboard/payments",
            icon: TimerIcon,
        },
        {
            title: "Products",
            url: "/admin/dashboard/products",
            icon: ListIcon,
        },
        {
            title: "Category",
            url: "/admin/dashboard/category",
            icon: WarehouseIcon,
        },
        {
            title: "Featured",
            url: "/admin/dashboard/featured",
            icon: SlidersIcon,
        },
    ],


}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data, isPending} = authClient.useSession()

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/">
                                <Logo/>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navLinks.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                {
                    isPending || !data ? <UserNavSkeleton/> : <NavUser session={data}/>
                }
            </SidebarFooter>
        </Sidebar>
    )
}
