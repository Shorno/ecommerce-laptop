'use client'
import {QueryClientProvider} from '@tanstack/react-query'
import type * as React from 'react'
import {getQueryClient} from "@/utils/get-query-client";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/components/theme-provider";

export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster  richColors position={"top-right"}/>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                    {children}
            </ThemeProvider>
        </QueryClientProvider>
    )
}