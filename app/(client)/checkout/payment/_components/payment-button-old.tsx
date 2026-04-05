"use client"
import {AlertCircle, ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTransition} from "react";
import {initiatePayment} from "@/app/actions/payment";
import {toast} from "sonner";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";

interface ProceedPaymentButtonProps {
    orderId: number;
}

export default function PaymentButtonOld({orderId}: ProceedPaymentButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()


    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Invalid Request
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Order ID is missing. Please try placing your order again.
                        </p>
                        <Button onClick={() => router.push("/checkout")} className="w-full">
                            Back to Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleClick = async () => {
        startTransition(async () => {
            try {
                const result = await initiatePayment(orderId)
                if (result.success && result.GatewayURL) {
                    window.location.href = result.GatewayURL
                } else {
                    toast.error("Payment initiation failed", {
                        description: result.error || "Please try again",
                    })
                }

            } catch {
                console.error("Payment error:")
                toast.error("Payment failed", {
                    description: "An error occurred while initiating payment. Please try again later.",
                })
            }
        });
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isPending}
            size="lg"
            className="w-full"

        >
            {isPending ? "Redirecting..." : "Proceed to Payment"}
            <ArrowRight className="h-4 w-4 ml-2"/>
        </Button>
    )
}