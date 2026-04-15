import {notFound} from "next/navigation"
import CustomerDetailView from "./_components/customer-detail-view"
import type {Metadata} from "next"

export const metadata: Metadata = {
    title: "Customer Detail — Admin",
    description: "View customer profile and order history.",
}

interface CustomerDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({params}: CustomerDetailPageProps) {
    const {id} = await params

    if (!id) {
        notFound()
    }

    return <CustomerDetailView customerId={id}/>
}
