"use client"

import {useSearchParams} from "next/navigation";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Clock, Package} from "lucide-react";
import Link from "next/link";

export default function PendingPaymentPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="max-w-2xl w-full">
                <CardContent className="pt-6">
                    <div className="text-center py-8 space-y-6">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="h-10 w-10 text-blue-600"/>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-blue-900 mb-2">
                                Payment Under Verification
                            </h1>
                            {orderNumber && (
                                <p className="text-sm font-medium text-foreground mb-1">
                                    Order #{orderNumber}
                                </p>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-blue-900 mb-2">
                                    ✓ Payment Details Submitted Successfully
                                </p>
                                <p className="text-sm text-blue-800">
                                    Your payment information has been received and is currently being verified by our team.
                                </p>
                            </div>

                            <div className="pt-3 border-t border-blue-200">
                                <p className="text-sm text-blue-900 font-medium mb-2">
                                    What happens next?
                                </p>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>Our team will verify your payment details</li>
                                    <li>You'll receive a confirmation email once verified</li>
                                    <li>Verification typically takes 15-30 minutes</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <p className="text-sm font-semibold text-amber-900 mb-3">
                                ⚠️ Payment Not Updated Within 1 Hour?
                            </p>
                            <p className="text-sm text-amber-800 mb-4">
                                If your payment status is not updated within one hour, please contact us with your transaction details:
                            </p>
                            <div className="space-y-2">
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                    <p className="text-xs text-amber-700 mb-1">For Valid Transaction Issues</p>
                                    <a
                                        href="tel:+8801XXXXXXXXX"
                                        className="text-base font-bold text-amber-900 hover:text-amber-700 transition-colors"
                                    >
                                        📞 +880 1XXX-XXXXXX
                                    </a>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                    <p className="text-xs text-amber-700 mb-1">Customer Support</p>
                                    <a
                                        href="tel:+8801XXXXXXXXX"
                                        className="text-base font-bold text-amber-900 hover:text-amber-700 transition-colors"
                                    >
                                        📞 +880 1XXX-XXXXXX
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            {orderId && (
                                <Button asChild className="flex-1">
                                    <Link href={`/account/orders/${orderId}`}>
                                        <Package className="h-4 w-4 mr-2"/>
                                        View Order Details
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="outline" className="flex-1">
                                <Link href="/">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}