import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

export default function PaymentVerificationSkeleton() {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            {/* Logo Header */}
            <div className="flex items-center justify-center py-6 border-b">
                <Skeleton className="w-32 h-12" />
            </div>

            <CardContent className="pt-6 space-y-6">
                {/* Invoice Details */}
                <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="w-40 h-5" />
                            <Skeleton className="w-48 h-4" />
                        </div>
                    </div>
                    <Skeleton className="w-24 h-8" />
                </div>

                {/* Instructions */}
                <div className="bg-muted rounded-lg p-6 space-y-4">
                    <Skeleton className="w-48 h-6 mx-auto" />

                    <Skeleton className="w-full h-10 rounded" />

                    <div className="space-y-3">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-12 rounded" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                    </div>
                </div>

                {/* Verify Button */}
                <Skeleton className="w-full h-11 rounded-md" />
            </CardContent>
        </Card>
    );
}
