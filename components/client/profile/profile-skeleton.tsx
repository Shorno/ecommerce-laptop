import {Skeleton} from "@/components/ui/skeleton"
import {Card, CardContent} from "@/components/ui/card"

export default function ProfileSkeleton() {
    return (
        <Card className="rounded-sm">
            <CardContent>
                <div className="space-y-4">
                    {/* Full Name & Phone Number - Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20"/>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28"/>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                    </div>

                    {/* City & Area - Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16"/>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16"/>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                    </div>

                    {/* Address Line - Full Width */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>

                    {/* Postal Code - Half Width */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24"/>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Skeleton className="h-10 w-[120px]"/>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
