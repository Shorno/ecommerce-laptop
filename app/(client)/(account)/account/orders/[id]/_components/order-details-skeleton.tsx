import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderDetailLoading() {
    return (
        <div className="container mx-auto">
            {/* Header Skeleton */}
            <div className="mb-6 sm:mb-8">
                <Button variant="ghost" size="sm" disabled className="mb-3 sm:mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back to Orders</span>
                    <span className="sm:hidden">Back</span>
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 sm:h-10 w-48" />
                        <Skeleton className="h-4 sm:h-5 w-32" />
                    </div>
                    <Skeleton className="h-8 sm:h-9 w-24 self-start sm:self-auto" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Order Info Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-64 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="px-0 sm:px-6">
                            {/* Mobile View Skeleton */}
                            <div className="sm:hidden space-y-4 px-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex gap-3">
                                            <Skeleton className="h-16 w-16 rounded-md shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Skeleton className="h-6 w-24" />
                                            <Skeleton className="h-6 w-20 ml-auto" />
                                        </div>
                                        <div className="pt-2 border-t flex justify-between">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table Skeleton */}
                            <div className="hidden sm:block border rounded-lg overflow-hidden">
                                <div className="p-4 border-b">
                                    <div className="grid grid-cols-5 gap-4">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 border-b last:border-b-0">
                                        <div className="grid grid-cols-5 gap-4 items-center">
                                            <Skeleton className="h-16 w-16 rounded-md" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                            <Skeleton className="h-6 w-12 mx-auto" />
                                            <Skeleton className="h-4 w-16 ml-auto" />
                                            <Skeleton className="h-4 w-20 ml-auto" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Order Summary Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-12" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Details Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 shrink-0" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 shrink-0" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 shrink-0" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-36" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
