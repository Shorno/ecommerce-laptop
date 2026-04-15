"use client"

import {
    IconDotsVertical,
    IconLogout,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Session} from "@/lib/auth";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {ShieldCheck} from "lucide-react";

export function NavUser({session}: { session: Session | null }) {
    const router = useRouter()
    const {isMobile} = useSidebar()
    if (!session) {
        return null
    }
    const handleLogOut = async () => {
        const {error} = await authClient.signOut()
        if (!error) {
            toast.success("Logged out successfully")
            router.replace("/")
        }
    }

    const user = session.user
    const initials = user.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "AD"

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="rounded-lg hover:bg-accent/60 data-[state=open]:bg-accent/60 transition-colors duration-200"
                        >
                            <Avatar className="h-8 w-8 rounded-lg ring-2 ring-primary/20 shadow-sm">
                                <AvatarImage src={user.image || ""} alt={user.name}/>
                                <AvatarFallback
                                    className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-[13px]">{user.name}</span>
                                <span className="text-muted-foreground truncate text-[11px] flex items-center gap-1">
                                    <ShieldCheck size={10} className="text-primary shrink-0"/>
                                    Admin
                                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4 text-muted-foreground/60"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl shadow-lg border border-border/60"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                                <Avatar className="h-10 w-10 rounded-lg ring-2 ring-primary/20 shadow-sm">
                                    <AvatarImage src={user.image || ""} alt={user.name}/>
                                    <AvatarFallback
                                        className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={handleLogOut}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 mx-1 rounded-md"
                        >
                            <IconLogout className="mr-2"/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
