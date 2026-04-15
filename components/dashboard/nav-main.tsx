"use client"

import {type Icon} from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {LucideIcon} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: Icon | LucideIcon
    }[]
}) {
    const {setOpenMobile} = useSidebar()
    const pathname = usePathname();

    return (
        <SidebarGroup className="py-0">
            <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                    {items.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                            <SidebarMenuItem key={item.title}>
                                <Link
                                    href={item.url}
                                    onClick={() => setOpenMobile(false)}
                                    className={cn(
                                        "group/nav-item relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                    )}
                                >
                                    {/* Active pill indicator */}
                                    {isActive && (
                                        <span
                                            className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)] transition-all duration-300"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {item.icon && (
                                        <item.icon
                                            size={18}
                                            strokeWidth={isActive ? 2.2 : 1.8}
                                            className={cn(
                                                "shrink-0 transition-colors duration-200",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-muted-foreground group-hover/nav-item:text-foreground"
                                            )}
                                        />
                                    )}
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
