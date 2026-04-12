"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
    ShoppingBag,
    User,
    Lock,
    LayoutDashboard,
    LogOut,
    ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const navSections = [
    {
        label: "Shopping",
        items: [
            {
                label: "Overview",
                href: "/account",
                icon: LayoutDashboard,
                exact: true,
            },
            {
                label: "My Orders",
                href: "/account/orders",
                icon: ShoppingBag,
            },
        ],
    },
    {
        label: "Settings",
        items: [
            {
                label: "Personal Info",
                href: "/account/profile",
                icon: User,
            },
            {
                label: "Change Password",
                href: "/account/password-change",
                icon: Lock,
            },
        ],
    },
]

// Map paths to breadcrumb labels
const pathLabels: Record<string, string> = {
    account: "My Account",
    orders: "My Orders",
    profile: "Personal Info",
    "password-change": "Change Password",
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession()
    const pathname = usePathname()
    const router = useRouter()

    if (isPending) {
        return <AccountSkeleton />
    }

    if (!session?.user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                            <Lock className="h-7 w-7 text-primary" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            Sign in to your account
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                            Access your orders, manage your profile, and track your deliveries — all in one place.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button asChild size="lg" className="w-full sm:w-auto min-w-[140px]">
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[140px]">
                            <Link href="/signup">Create Account</Link>
                        </Button>
                    </div>

                    {/* Help text */}
                    <p className="text-xs text-muted-foreground/60">
                        Need help? <Link href="/" className="text-primary hover:underline">Contact support</Link>
                    </p>
                </div>
            </div>
        )
    }

    const user = session.user
    const initials = user.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : user.email?.[0]?.toUpperCase() || "U"

    // Build breadcrumbs from pathname
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = segments.map((seg, i) => ({
        label: pathLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, i + 1).join("/"),
        isLast: i === segments.length - 1,
    }))

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.refresh()
                    router.push("/")
                },
            },
        })
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb bar */}
            <div className="border-b border-border bg-muted/30">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        {breadcrumbs.map((crumb) => (
                            <span key={crumb.href} className="flex items-center gap-1.5">
                                <ChevronRight className="h-3.5 w-3.5" />
                                {crumb.isLast ? (
                                    <span className="text-foreground font-medium">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                                        {crumb.label}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Mobile: horizontal scrolling nav */}
                <div className="md:hidden mb-6">
                    <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
                        {navSections.flatMap(s => s.items).map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname === item.href || pathname.startsWith(item.href + "/")
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <aside className="hidden md:block w-[260px] shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* User identity card */}
                            <div className="flex items-center gap-3.5 px-2">
                                <Avatar className="h-11 w-11">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {user.name || "User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Navigation sections */}
                            <nav className="space-y-5">
                                {navSections.map((section) => (
                                    <div key={section.label}>
                                        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1.5">
                                            {section.label}
                                        </p>
                                        <div className="space-y-0.5">
                                            {section.items.map((item) => {
                                                const isActive = item.exact
                                                    ? pathname === item.href
                                                    : pathname === item.href || pathname.startsWith(item.href + "/")
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150",
                                                            isActive
                                                                ? "bg-primary/8 text-primary border-l-[3px] border-primary -ml-px"
                                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        )}
                                                    >
                                                        <item.icon className={cn(
                                                            "h-[18px] w-[18px] shrink-0 transition-colors",
                                                            isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                                                        )} />
                                                        {item.label}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </nav>

                            <Separator />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
                            >
                                <LogOut className="h-[18px] w-[18px] shrink-0" />
                                Sign Out
                            </button>
                        </div>
                    </aside>

                    {/* Content area */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

function AccountSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-muted/30">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    <aside className="hidden md:block w-[260px] shrink-0 space-y-6">
                        <div className="flex items-center gap-3.5 px-2">
                            <Skeleton className="h-11 w-11 rounded-full" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-9 w-full rounded-md" />
                            ))}
                        </div>
                    </aside>
                    <main className="flex-1">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="h-32 rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
