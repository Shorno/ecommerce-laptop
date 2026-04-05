import Link from "next/link"
import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EmptyOrders() {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg sm:text-xl font-medium mb-2">No orders yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center max-w-md">
                    You haven&apos;t placed any orders. Start shopping to see your orders here.
                </p>
                <Button asChild>
                    <Link href="/">Start Shopping</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
