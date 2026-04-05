"use client"

import {useSearchParams} from "next/navigation";
import BkashVerificationCard from "@/app/(client)/checkout/payment/verify/_components/bKash-verification-card";
import RocketVerificationCard from "@/app/(client)/checkout/payment/verify/_components/rocket-verification-card";
import {useQuery} from "@tanstack/react-query";
import {getOrderById} from "@/app/actions/order";
import PaymentErrorCard from "@/app/(client)/checkout/payment/verify/_components/payment-error-card";
import PaymentVerificationSkeleton
    from "@/app/(client)/checkout/payment/verify/_components/payment-verification-skeleton";

export default function PaymentVerificationPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const paymentMethod = searchParams.get("paymentMethod");

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderById(Number(orderId)),
        enabled: !!orderId,
    });

    // Validation errors
    if (!orderId) {
        return (
            <div className="min-h-screen py-8 px-4">
                <PaymentErrorCard
                    title="Invalid Request"
                    message="Order ID is missing from the URL. Please return to checkout and try again."
                    showRetry={false}
                />
            </div>
        );
    }

    if (!paymentMethod || (paymentMethod !== "bKash" && paymentMethod !== "rocket")) {
        return (
            <div className="min-h-screen py-8 px-4">
                <PaymentErrorCard
                    title="Invalid Payment Method"
                    message="The selected payment method is invalid. Please go back and select a valid payment option."
                    showRetry={false}
                />
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen py-8 px-4">
                <PaymentVerificationSkeleton />
            </div>
        );
    }

    // Data error
    if (isError || !data) {
        return (
            <div className="min-h-screen py-8 px-4">
                <PaymentErrorCard
                    title="Failed to Load Order"
                    message="We couldn't retrieve your order details. This might be due to an invalid order ID or network issues."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    // Render payment verification card based on selected method
    return (
        <div className="min-h-screen py-8 px-4">
            {paymentMethod === "bKash" && <BkashVerificationCard order={data} />}
            {paymentMethod === "rocket" && <RocketVerificationCard order={data} />}
        </div>
    );
}
