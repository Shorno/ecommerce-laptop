import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Complete your order and choose your payment method.",
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

