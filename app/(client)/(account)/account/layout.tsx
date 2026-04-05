"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {authClient} from "@/lib/auth-client";

const accountNavLinks = [
    {
        label: "My Orders",
        href: "/account/orders",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>
        ),
    },
    {
        label: "My Profile",
        href: "/account/profile",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
    },
    {
        label: "Change Password",
        href: "/account/password-change",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
            </svg>
        ),
    },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const session = authClient.useSession()
    const pathname = usePathname()
    const lastPath = pathname.split('/').filter(Boolean).pop();

    if (!session?.data?.user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">Please log in to view your {lastPath}.</p>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        )
    }


    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your orders and information</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="md:col-span-1">
                        <nav className="space-y-2">
                            {accountNavLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link key={link.href} href={link.href} className="block">
                                        <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3" asChild>
                      <span>
                        {link.icon}
                          <span>{link.label}</span>
                      </span>
                                        </Button>
                                    </Link>
                                )
                            })}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="md:col-span-3">
                        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
