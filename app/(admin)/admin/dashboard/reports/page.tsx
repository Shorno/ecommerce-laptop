import AnalyticsDashboard from "@/app/(admin)/admin/dashboard/reports/_components/analytics-dashboard"
import type {Metadata} from "next"

export const metadata: Metadata = {
    title: "Reports & Analytics — Admin",
    description: "View comprehensive sales, customer, and product analytics.",
}

export default function ReportsPage() {
    return (
        <div>
            <div className="mb-4">
                <h1 className="text-lg font-semibold">Reports & Analytics</h1>
                <p className="text-xs text-muted-foreground">
                    Revenue, orders, customers, and product performance at a glance.
                </p>
            </div>
            <AnalyticsDashboard/>
        </div>
    )
}
