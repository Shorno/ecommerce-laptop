"use client"

import {useState} from "react"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {Star, MessageSquare, Loader, Send, LogIn} from "lucide-react"
import Link from "next/link"
import {toast} from "sonner"

import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Input} from "@/components/ui/input"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Separator} from "@/components/ui/separator"
import {cn} from "@/lib/utils"
import {
    getProductReviews,
    canUserReview,
    submitReview,
    type PublicReview,
} from "@/app/actions/reviews/review-actions"

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Star Rating Input ──
function StarRatingInput({value, onChange}: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0)

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="p-0.5 transition-transform hover:scale-110"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                >
                    <Star
                        className={cn(
                            "h-6 w-6 transition-colors",
                            (hovered || value) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-transparent text-muted-foreground/30"
                        )}
                    />
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                    {value === 1 && "Poor"}
                    {value === 2 && "Fair"}
                    {value === 3 && "Good"}
                    {value === 4 && "Very Good"}
                    {value === 5 && "Excellent"}
                </span>
            )}
        </div>
    )
}

// ── Star Rating Display ──
function StarRating({rating, size = "sm"}: { rating: number; size?: "sm" | "md" }) {
    const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        iconSize,
                        rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : rating >= star - 0.5
                                ? "fill-yellow-400/50 text-yellow-400"
                                : "fill-transparent text-muted-foreground/20"
                    )}
                />
            ))}
        </div>
    )
}

// ── Rating Distribution Bar ──
function RatingBar({stars, count, total}: { stars: number; count: number; total: number }) {
    const percent = total > 0 ? (count / total) * 100 : 0
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-3 text-right text-muted-foreground">{stars}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0"/>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{width: `${percent}%`}}
                />
            </div>
            <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
        </div>
    )
}

// ── Review Form ──
function ReviewForm({productId, onSuccess}: { productId: number; onSuccess: () => void }) {
    const [rating, setRating] = useState(0)
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    const mutation = useMutation({
        mutationFn: () => submitReview({productId, rating, title, body}),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Review submitted!", {
                    description: "Your review will be visible after admin approval.",
                })
                setRating(0)
                setTitle("")
                setBody("")
                onSuccess()
            } else {
                toast.error(result.error || "Failed to submit review")
            }
        },
        onError: () => toast.error("Something went wrong"),
    })

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Write a Review</h3>

            <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Your Rating *</label>
                <StarRatingInput value={rating} onChange={setRating}/>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Title (optional)</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={200}
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Your Review (optional)</label>
                <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                />
            </div>

            <Button
                onClick={() => mutation.mutate()}
                disabled={rating === 0 || mutation.isPending}
                size="sm"
                className="gap-1.5"
            >
                {mutation.isPending ? <Loader className="h-3.5 w-3.5 animate-spin"/> :
                    <Send className="h-3.5 w-3.5"/>}
                Submit Review
            </Button>
        </div>
    )
}

// ── Single Review Card ──
function ReviewCard({review}: { review: PublicReview }) {
    return (
        <div className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 ring-1 ring-border shrink-0">
                    <AvatarImage src={review.userImage || ""} alt={review.userName}/>
                    <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                        {getInitials(review.userName)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{review.userName}</span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="mt-1">
                        <StarRating rating={review.rating}/>
                    </div>
                    {review.title && (
                        <p className="text-sm font-medium mt-2">{review.title}</p>
                    )}
                    {review.body && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {review.body}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Main Product Reviews Section ──
export default function ProductReviews({productId}: { productId: number }) {
    const queryClient = useQueryClient()

    const {data: reviewData, isLoading: loadingReviews} = useQuery({
        queryKey: ["product-reviews", productId],
        queryFn: () => getProductReviews(productId),
    })

    const {data: eligibility, isLoading: loadingEligibility} = useQuery({
        queryKey: ["can-review", productId],
        queryFn: () => canUserReview(productId),
    })

    const reviews = reviewData?.reviews ?? []
    const averageRating = reviewData?.averageRating ?? 0
    const totalReviews = reviewData?.totalReviews ?? 0
    const ratingDistribution = reviewData?.ratingDistribution ?? {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    return (
        <div className="space-y-6">
            {/* Summary + Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6">
                {/* Average Score */}
                <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl border bg-card">
                    <p className="text-4xl font-bold tabular-nums">
                        {totalReviews > 0 ? averageRating.toFixed(1) : "—"}
                    </p>
                    <StarRating rating={Math.round(averageRating)} size="md"/>
                    <p className="text-xs text-muted-foreground mt-1.5">
                        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                </div>

                {/* Distribution */}
                <div className="space-y-1.5 justify-center flex flex-col">
                    {[5, 4, 3, 2, 1].map((stars) => (
                        <RatingBar
                            key={stars}
                            stars={stars}
                            count={ratingDistribution[stars] || 0}
                            total={totalReviews}
                        />
                    ))}
                </div>
            </div>

            <Separator/>

            {/* Review Form or Login Prompt */}
            {!loadingEligibility && eligibility?.canReview && (
                <ReviewForm
                    productId={productId}
                    onSuccess={() => {
                        queryClient.invalidateQueries({queryKey: ["product-reviews", productId]})
                        queryClient.invalidateQueries({queryKey: ["can-review", productId]})
                    }}
                />
            )}

            {!loadingEligibility && eligibility?.reason === "login" && (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 flex flex-col items-center text-center space-y-3">
                    <LogIn className="h-6 w-6 text-muted-foreground"/>
                    <div>
                        <p className="text-sm font-medium">Sign in to leave a review</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Only logged-in customers can submit reviews.
                        </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/signin">Sign In</Link>
                    </Button>
                </div>
            )}

            {!loadingEligibility && eligibility?.reason === "already_reviewed" && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        ✓ You&apos;ve already submitted a review for this product.
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
                <div className="flex items-center justify-center py-12">
                    <Loader className="h-5 w-5 animate-spin text-muted-foreground"/>
                </div>
            ) : reviews.length > 0 ? (
                <div className="divide-y divide-border">
                    {reviews.map((r) => (
                        <ReviewCard key={r.id} review={r}/>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-3"/>
                    <p className="text-sm font-medium text-muted-foreground">No reviews yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                        Be the first to share your experience with this product.
                    </p>
                </div>
            )}
        </div>
    )
}
