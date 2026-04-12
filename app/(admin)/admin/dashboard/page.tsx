import type { Metadata } from "next"
import AdminDashboardOverview from "@/app/(admin)/admin/dashboard/_components/dashboard-overview"

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Overview of store performance, orders, and key metrics.",
}

export default function AdminDashboardPage() {
    return <AdminDashboardOverview />
}
