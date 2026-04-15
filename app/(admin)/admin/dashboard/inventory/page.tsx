import InventoryList from "@/app/(admin)/admin/dashboard/inventory/_components/inventory-list"
import type {Metadata} from "next"

export const metadata: Metadata = {
    title: "Inventory — Admin",
    description: "Manage product stock levels across all variants.",
}

export default function InventoryPage() {
    return (
        <div className="container mx-auto">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Monitor and manage stock levels across all product variants.
                </p>
            </div>
            <InventoryList/>
        </div>
    )
}
