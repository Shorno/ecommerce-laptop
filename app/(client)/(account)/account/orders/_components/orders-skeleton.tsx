export default function OrdersLoading() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="border rounded-lg p-6 animate-pulse"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                            <div className="h-5 bg-muted rounded w-32"></div>
                            <div className="h-4 bg-muted rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-4">
                            <div className="h-16 w-16 bg-muted rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-5 bg-muted rounded w-20"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

