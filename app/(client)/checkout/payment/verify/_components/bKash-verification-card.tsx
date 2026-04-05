"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Copy, CheckCircle2} from "lucide-react";
import {toast} from "sonner";
import Image from "next/image";
import {PAYMENT_CONFIG, MERCHANT_INFO} from "@/lib/payment-config";
import {OrderData} from "@/lib/types/order";
import {useState, useTransition} from "react";
import {submitManualPayment} from "@/app/actions/manual-payment";
import {useRouter} from "next/navigation";

interface BkashVerificationCardProps {
    order: OrderData;
}

export default function BkashVerificationCard({order}: BkashVerificationCardProps) {
    const config = PAYMENT_CONFIG.bKash;
    const [senderNumber, setSenderNumber] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCopy = () => {
        navigator.clipboard.writeText(config.merchantNumber);
        toast.success("Copied to clipboard");
    };

    const handleVerify = async () => {
        if (!senderNumber.trim()) {
            toast.error("Please enter your bKash number");
            return;
        }
        if (!transactionId.trim()) {
            toast.error("Please enter transaction ID");
            return;
        }

        startTransition(async () => {
            try {
                const result = await submitManualPayment({
                    orderId: order.id,
                    transactionId: transactionId.trim(),
                    senderNumber: senderNumber.trim(),
                    paymentMethod: "bKash",
                });

                if (result.success) {
                    toast.success(result.message || "Payment submitted successfully!");
                    router.push(`/checkout/payment/pending?orderId=${order.id}`);
                } else {
                    toast.error(result.error || "Failed to submit payment");
                }
            } catch {
                toast.error("An error occurred. Please try again.");
            }
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            {/* Logo Header */}
            <div className="flex items-center justify-center py-6 border-b">
                <Image
                    src={config.logo}
                    alt={config.name}
                    width={120}
                    height={60}
                    className="object-contain"
                />
            </div>

            <CardContent className="pt-6 space-y-6">
                {/* Invoice Details */}
                <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Image
                                src={MERCHANT_INFO.logo}
                                alt={MERCHANT_INFO.name}
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{MERCHANT_INFO.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                Invoice ID: <span className="font-mono">{order.orderNumber}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">৳ {order.totalAmount}</p>
                    </div>
                </div>

                {/* Instructions */}
                <div className={`${config.color} text-white rounded-lg p-6 space-y-4`}>
                    <h2 className="text-xl font-bold text-center">Payment Verification</h2>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Your bKash Number
                            </label>
                            <Input
                                placeholder="01XXXXXXXXX"
                                value={senderNumber}
                                onChange={(e) => setSenderNumber(e.target.value)}
                                className="bg-white text-black placeholder:text-gray-400"
                                maxLength={11}
                                disabled={isPending}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Transaction ID
                            </label>
                            <Input
                                placeholder="Enter Transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="bg-white text-black placeholder:text-gray-400"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="font-semibold text-sm">How to Send Money:</h3>

                        <ol className="space-y-2.5 text-sm list-decimal list-inside marker:font-bold">
                            <li className="pl-2">
                                Dial <span className="font-bold">{config.dialCode}</span> or open the bKash App
                            </li>

                            <li className="pl-2">
                                Select <span className="font-bold text-yellow-300">&quot;Send Money&quot;</span>
                            </li>

                            <li className="pl-2">
                                Enter receiver number:{" "}
                                <span className="font-bold">{config.merchantNumber}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20 ml-2 inline-flex"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </li>

                            <li className="pl-2">
                                Enter amount: <span className="font-bold">৳{order.totalAmount}</span>
                            </li>

                            <li className="pl-2">
                                Enter your bKash Mobile Menu PIN to confirm
                            </li>

                            <li className="pl-2">
                                Copy the Transaction ID from the confirmation message
                            </li>

                            <li className="pl-2">
                                Paste your <span className="font-bold text-yellow-300">bKash Number</span> and{" "}
                                <span className="font-bold text-yellow-300">Transaction ID</span> above, then click{" "}
                                <span className="font-bold">VERIFY</span>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Verify Button */}
                <Button
                    onClick={handleVerify}
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {isPending ? "SUBMITTING..." : "VERIFY PAYMENT"}
                </Button>
            </CardContent>
        </Card>
    );
}
