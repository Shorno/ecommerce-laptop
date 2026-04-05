import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="font-medium text-sm sm:text-base">Cash on Delivery</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Payment will be collected upon delivery
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
