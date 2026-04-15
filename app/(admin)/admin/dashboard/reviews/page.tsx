import ReviewList from "@/app/(admin)/admin/dashboard/reviews/_components/review-list"
import type {Metadata} from "next"

export const metadata: Metadata = {
    title: "Reviews — Admin",
    description: "Moderate and manage customer product reviews.",
}

export default function ReviewsPage() {
    return (
        <div className="container mx-auto">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Reviews</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Moderate customer reviews. Only approved reviews are visible to shoppers.
                </p>
            </div>
            <ReviewList/>
        </div>
    )
}
