import CustomerList from "@/app/(admin)/admin/dashboard/customers/_components/customer-list"

export default function CustomersPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Customers</h1>
            <CustomerList/>
        </div>
    )
}
