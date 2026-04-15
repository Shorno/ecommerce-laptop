"use client"
import {Button} from "@/components/ui/button"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {usePathname, useRouter} from "next/navigation"
import {authClient} from "@/lib/auth-client"
import {LogOutIcon} from "lucide-react"
import {toast} from "sonner"
import Link from "next/link"
import React from "react"
import {LanguageSwitcher} from "@/components/language-switcher";

export function SiteHeader() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogOut = async () => {
        const {error} = await authClient.signOut()
        if (!error){
            toast.success("Logged out successfully")
            router.replace("/")
        }
    }

    const pathSegments = pathname.split('/').filter(Boolean)
    const dashboardIndex = pathSegments.indexOf('dashboard')
    const breadcrumbSegments = dashboardIndex !== -1
        ? pathSegments.slice(dashboardIndex + 1)
        : []

    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />

                {breadcrumbSegments.length > 0 ? (
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbSegments.map((segment, index) => {
                                const href = `/admin/dashboard/${breadcrumbSegments.slice(0, index + 1).join('/')}`
                                const isLast = index === breadcrumbSegments.length - 1
                                const label = segment.charAt(0).toUpperCase() + segment.slice(1)

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                )
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                ) : (
                    <h1 className="text-sm font-semibold tracking-tight">Dashboard</h1>
                )}

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 cursor-pointer"
                        onClick={handleLogOut}
                    >
                        <LogOutIcon size={16}/>
                        <span className="text-xs font-medium">Logout</span>
                    </Button>
                    <LanguageSwitcher/>
                </div>
            </div>
        </header>
    )
}
