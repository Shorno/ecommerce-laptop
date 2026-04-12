import { notFound } from "next/navigation"
import AdminOrderDetail from "./_components/admin-order-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Order Detail — Admin",
    description: "Manage and process an individual order.",
}

interface AdminOrderDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
        notFound()
    }

    return <AdminOrderDetail orderId={orderId} />
}
