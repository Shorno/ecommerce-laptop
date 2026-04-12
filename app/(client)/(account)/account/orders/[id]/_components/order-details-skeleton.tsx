import { Skeleton } from "@/components/ui/skeleton"

export default function OrderDetailLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            {/* Timeline skeleton */}
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="hidden sm:flex items-center justify-between gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center flex-1 last:flex-none gap-2">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            {i < 5 && <Skeleton className="h-0.5 flex-1" />}
                        </div>
                    ))}
                </div>
                <div className="sm:hidden flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-6 w-20 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Items skeleton */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <Skeleton className="h-4 w-28" />
                </div>
                <div className="divide-y divide-border">
                    {[1, 2].map(i => (
                        <div key={i} className="flex gap-4 p-4 sm:px-6 sm:py-5">
                            <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16 sm:hidden" />
                            </div>
                            <div className="hidden sm:flex gap-8">
                                <Skeleton className="h-6 w-8" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-border bg-muted/30">
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <div className="p-4 sm:px-6 sm:py-5 space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-border bg-muted/30">
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <div className="p-4 sm:px-6 sm:py-5 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
