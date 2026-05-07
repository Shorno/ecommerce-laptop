import {Suspense} from "react"
import {Skeleton} from "@/components/ui/skeleton"
import FlashSaleManager from "./_components/flash-sale-manager"

export const metadata = {
    title: "Flash Sales",
}

export default function FlashSalesPage() {
    return (
        <div className="flex-1 p-4 lg:p-6 space-y-6">
            <div>
                <h1 className="text-lg font-semibold">Flash Sales</h1>
                <p className="text-sm text-muted-foreground">
                    Create and manage flash sales with timed discounts.
                </p>
            </div>

            <Suspense fallback={
                <div className="space-y-4">
                    <Skeleton className="h-10 w-40"/>
                    <Skeleton className="h-64 w-full rounded-lg"/>
                </div>
            }>
                <FlashSaleManager/>
            </Suspense>
        </div>
    )
}
