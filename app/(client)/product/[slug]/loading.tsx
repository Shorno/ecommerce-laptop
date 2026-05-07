import {Skeleton} from "@/components/ui/skeleton"

export default function ProductLoading() {
    return (
        <div className="bg-tech-bg dark:bg-background min-h-screen">
            <div className="custom-container py-4 md:py-8">
                {/* Breadcrumb Skeleton */}
                <nav className="flex items-center gap-2 mb-6">
                    <Skeleton className="h-4 w-20"/>
                    <span className="text-border">/</span>
                    <Skeleton className="h-4 w-24"/>
                    <span className="text-border">/</span>
                    <Skeleton className="h-4 w-32"/>
                </nav>

                {/* Hero Section Skeleton */}
                <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left - Image Gallery */}
                        <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/20 to-muted/5">
                            <Skeleton className="aspect-square w-full rounded-xl"/>
                            {/* Thumbnails */}
                            <div className="flex gap-2 mt-3">
                                {Array.from({length: 4}).map((_, i) => (
                                    <Skeleton key={i} className="w-16 h-16 rounded-lg flex-shrink-0"/>
                                ))}
                            </div>
                        </div>

                        {/* Right - Product Info */}
                        <div className="p-5 md:p-6 lg:p-8 flex flex-col gap-4">
                            {/* Category */}
                            <Skeleton className="h-3 w-20"/>

                            {/* Product Name */}
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-full"/>
                                <Skeleton className="h-7 w-3/4"/>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm"/>
                                    ))}
                                </div>
                                <Skeleton className="h-3.5 w-16"/>
                            </div>

                            {/* Key Features */}
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-3 w-24"/>
                                {Array.from({length: 5}).map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <Skeleton className="h-4 w-28 flex-shrink-0"/>
                                        <Skeleton className="h-4 w-40"/>
                                    </div>
                                ))}
                            </div>

                            {/* Spacer */}
                            <div className="flex-1"/>

                            {/* Price Section */}
                            <div className="border-t border-border/40 pt-4 space-y-3">
                                <Skeleton className="h-8 w-36"/>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20"/>
                                    <Skeleton className="h-5 w-16 rounded-full"/>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Skeleton className="h-11 flex-1 rounded-lg"/>
                                <Skeleton className="h-11 flex-1 rounded-lg"/>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-4 pt-3 border-t border-border/40">
                                {Array.from({length: 3}).map((_, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <Skeleton className="h-4 w-4 rounded-full"/>
                                        <Skeleton className="h-3 w-20"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Nav Skeleton */}
                <div className="mt-6 flex gap-6 border-b border-border/40 pb-3">
                    <Skeleton className="h-5 w-24"/>
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-5 w-16"/>
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mt-6">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Specifications Table */}
                        <div className="bg-card rounded-xl border border-border/60 p-5">
                            <Skeleton className="h-5 w-32 mb-4"/>
                            <div className="space-y-0">
                                {Array.from({length: 6}).map((_, i) => (
                                    <div key={i}
                                         className={`flex gap-4 py-3 ${i < 5 ? "border-b border-border/30" : ""}`}>
                                        <Skeleton className="h-4 w-32 flex-shrink-0"/>
                                        <Skeleton className="h-4 w-48"/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-card rounded-xl border border-border/60 p-5">
                            <Skeleton className="h-5 w-28 mb-4"/>
                            <div className="space-y-2.5">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-5/6"/>
                                <Skeleton className="h-4 w-3/4"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-2/3"/>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Related Products */}
                    <div className="hidden lg:block">
                        <div className="bg-card rounded-xl border border-border/60 p-4">
                            <Skeleton className="h-5 w-32 mb-4"/>
                            <div className="space-y-3">
                                {Array.from({length: 3}).map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0"/>
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-3.5 w-full"/>
                                            <Skeleton className="h-3.5 w-3/4"/>
                                            <Skeleton className="h-4 w-20"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
