"use client"

import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {Card, CardContent} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import Image from "next/image";

interface PaymentMethodAndButtonProps {
    orderId: number;
}


type PaymentMethod = "bKash" | "rocket";


export default function PaymentMethodAndButton({orderId}: PaymentMethodAndButtonProps) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleProceedToPayment = () => {
        startTransition(async () => {
            try {
                if (!selectedPaymentMethod) {
                    toast.error("Please select a payment method");
                    return;
                }

                router.push(`/checkout/payment/verify?orderId=${orderId}&paymentMethod=${selectedPaymentMethod}`);

            } catch (error) {
                console.error("Payment error:", error);
                toast.error("Payment failed", {
                    description: "An error occurred. Please try again later.",
                });
            }
        });
    };

    return (
        <>
            {/* Payment Method Selection Card */}
            <Card className="mb-4">
                <CardContent className="pt-6">
                    <FieldGroup>
                        <FieldSet>
                            <FieldLabel htmlFor="payment-method" className="mb-3">
                                Payment Method
                            </FieldLabel>
                            <RadioGroup
                                value={selectedPaymentMethod}
                                onValueChange={setSelectedPaymentMethod as (value: PaymentMethod) => void}
                                className="flex gap-3"
                            >
                                <FieldLabel htmlFor="bkash" className="cursor-pointer">
                                    <div
                                        className="relative w-full h-auto rounded-lg border-2 border-muted hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden has-[:checked]:border-primary has-[:checked]:border-4 p-3"
                                    >
                                        <Image
                                            src="/logos/bkash.png"
                                            alt="bKash"
                                            width={80}
                                            height={40}
                                            className="object-contain w-full h-auto"
                                        />
                                        <RadioGroupItem
                                            value="bKash"
                                            id="bKash"
                                            className="absolute top-2 right-2"
                                        />
                                    </div>
                                </FieldLabel>
                                <FieldLabel htmlFor="rocket" className="cursor-pointer">
                                    <div
                                        className="relative rounded-lg border-2 border-muted bg-background hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden has-[:checked]:border-primary has-[:checked]:border-4 p-0"
                                    >
                                        <Image
                                            src="/logos/rocket.png"
                                            alt="Rocket"
                                            width={80}
                                            height={40}
                                            className="object-contain w-full h-auto"
                                        />
                                        <RadioGroupItem
                                            value="rocket"
                                            id="rocket"
                                            className="absolute top-2 right-2"
                                        />
                                    </div>
                                </FieldLabel>
                            </RadioGroup>
                        </FieldSet>
                    </FieldGroup>
                </CardContent>
            </Card>

            {/* Proceed Button */}
            <Button
                onClick={handleProceedToPayment}
                disabled={isPending}
                size="lg"
                className="w-full"
            >
                {isPending ? "Processing..." : "Proceed to Payment"}
                <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
        </>
    )
}
