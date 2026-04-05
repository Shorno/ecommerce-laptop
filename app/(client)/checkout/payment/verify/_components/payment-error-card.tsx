"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AlertCircle, Home, RefreshCw} from "lucide-react";
import {useRouter} from "next/navigation";
import Image from "next/image";

interface PaymentErrorCardProps {
    title?: string;
    message?: string;
    showRetry?: boolean;
    showHomeButton?: boolean;
    onRetry?: () => void;
}

export default function PaymentErrorCard({
                                             title = "Something Went Wrong",
                                             message = "We couldn't load your order details. Please try again or contact support if the problem persists.",
                                             showRetry = true,
                                             showHomeButton = true,
                                             onRetry
                                         }: PaymentErrorCardProps) {
    const router = useRouter();

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            {/* Logo Header */}
            <div className="flex items-center justify-center py-6 border-b">
                <Image
                    src="/logo.png"
                    alt="Game Lounge Eshop"
                    width={120}
                    height={60}
                    className="object-contain"
                />
            </div>

            <CardContent className="pt-8 pb-8">
                {/* Error Icon and Message */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                        <p className="text-muted-foreground max-w-md">
                            {message}
                        </p>
                    </div>

                    {/* Error Details Card */}
                    <div className="w-full bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium">Common issues:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 text-left list-disc list-inside">
                            <li>Invalid or missing order ID</li>
                            <li>Network connection problems</li>
                            <li>Order has already been processed</li>
                            <li>Session has expired</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3 pt-2">
                        {showRetry && (
                            <Button
                                onClick={handleRetry}
                                className="w-full"
                                size="lg"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}

                        {showHomeButton && (
                            <Button
                                onClick={() => router.push("/")}
                                variant="outline"
                                className="w-full"
                                size="lg"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        )}
                    </div>

                    {/* Help Text */}
                    <p className="text-xs text-muted-foreground pt-4">
                        Need help? Contact us at <span className="font-semibold">support@gamelounge.com</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
