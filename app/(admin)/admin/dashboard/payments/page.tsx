import PendingPaymentsList from "@/app/(admin)/admin/dashboard/orders/_components/pending-payments-list";

export default async function PendingPaymentsPage() {
    return (
        <div className="container mx-auto">
            <PendingPaymentsList/>
        </div>
    )
}
