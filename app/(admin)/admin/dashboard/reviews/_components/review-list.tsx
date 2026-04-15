"use client"

import {useQuery} from "@tanstack/react-query"
import {getAdminReviews} from "@/app/actions/reviews/review-actions"
import ReviewTable from "@/app/(admin)/admin/dashboard/reviews/_components/review-table"
import {reviewColumns} from "@/app/(admin)/admin/dashboard/reviews/_components/review-columns"
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton"

export default function ReviewList() {
    const {data: reviews = [], isLoading} = useQuery({
        queryKey: ["admin-reviews"],
        queryFn: getAdminReviews,
    })

    if (isLoading) {
        return <TableSkeleton columns={8} rows={6}/>
    }

    const stats = {
        total: reviews.length,
        pending: reviews.filter(r => !r.isApproved).length,
        approved: reviews.filter(r => r.isApproved).length,
    }

    return <ReviewTable columns={reviewColumns} data={reviews} stats={stats}/>
}
