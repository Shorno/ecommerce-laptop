import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/dashboard/app-sidebar";
import {SiteHeader} from "@/components/dashboard/site-header";
import {unauthorized} from "next/navigation";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {checkAuth} from "@/app/actions/auth/checkAuth";

export default async function AdminDashboardLayout({children}: { children: React.ReactNode }) {
    const session = await checkAuth();
    const isAdmin = session?.user?.role === "admin";
    const messages = await getMessages();

    if (!isAdmin) {
        unauthorized()
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                            <NextIntlClientProvider messages={messages}>
                                {children}
                            </NextIntlClientProvider>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}