"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, Star, Check, X, Trash2, Loader} from "lucide-react"
import Link from "next/link"
import {useState} from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type {AdminReviewItem} from "@/app/actions/reviews/review-actions"
import {updateReviewApproval, deleteReview} from "@/app/actions/reviews/review-actions"

// Inline approval toggle
function ApprovalCell({item}: { item: AdminReviewItem }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (isApproved: boolean) => updateReviewApproval(item.id, isApproved),
        onSuccess: (result) => {
            if (result.success) {
                toast.success(item.isApproved ? "Review hidden" : "Review approved")
                queryClient.invalidateQueries({queryKey: ["admin-reviews"]})
            } else {
                toast.error(result.error || "Failed to update")
            }
        },
        onError: () => toast.error("Failed to update"),
    })

    return (
        <div className="flex justify-center gap-1">
            {item.isApproved ? (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={() => mutation.mutate(false)}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? <Loader className="h-3.5 w-3.5 animate-spin"/> :
                        <X className="h-3.5 w-3.5"/>}
                    Reject
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => mutation.mutate(true)}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? <Loader className="h-3.5 w-3.5 animate-spin"/> :
                        <Check className="h-3.5 w-3.5"/>}
                    Approve
                </Button>
            )}
        </div>
    )
}

// Delete action
function DeleteCell({item}: { item: AdminReviewItem }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: () => deleteReview(item.id),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Review deleted")
                queryClient.invalidateQueries({queryKey: ["admin-reviews"]})
            } else {
                toast.error(result.error || "Failed to delete")
            }
        },
        onError: () => toast.error("Failed to delete"),
    })

    return (
        <div className="flex justify-center">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this review. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export const reviewColumns: ColumnDef<AdminReviewItem>[] = [
    {
        accessorKey: "productName",
        header: () => <div className="text-left">Product</div>,
        cell: ({row}) => (
            <Link
                href={`/admin/dashboard/products/edit/${row.original.productId}`}
                className="text-sm font-medium hover:text-primary hover:underline transition-colors truncate max-w-[200px] block"
            >
                {row.getValue("productName")}
            </Link>
        ),
    },
    {
        accessorKey: "rating",
        header: ({column}) => (
            <div className="flex justify-center">
                <Button variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        ),
        cell: ({row}) => {
            const rating = row.getValue("rating") as number
            return (
                <div className="flex justify-center items-center gap-1">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={cn(
                                    "h-3.5 w-3.5",
                                    rating >= s
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-transparent text-muted-foreground/20"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "title",
        header: () => <div className="text-left">Review</div>,
        cell: ({row}) => {
            const title = row.original.title
            const body = row.original.body
            return (
                <div className="max-w-[300px]">
                    {title && <p className="text-sm font-medium truncate">{title}</p>}
                    {body && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{body}</p>
                    )}
                    {!title && !body && (
                        <span className="text-xs text-muted-foreground italic">No content</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "userName",
        header: () => <div className="text-left">Customer</div>,
        cell: ({row}) => (
            <div className="flex flex-col">
                <span className="text-sm font-medium">{row.original.userName}</span>
                <span className="text-xs text-muted-foreground">{row.original.userEmail}</span>
            </div>
        ),
    },
    {
        accessorKey: "isApproved",
        header: () => <div className="text-center">Status</div>,
        cell: ({row}) => {
            const approved = row.getValue("isApproved") as boolean
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={approved ? "default" : "secondary"}
                        className={cn("text-[11px]", approved ? "bg-green-600" : "")}
                    >
                        {approved ? "Approved" : "Pending"}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            if (value === "all") return true
            if (value === "pending") return !row.getValue(id)
            if (value === "approved") return !!row.getValue(id)
            return true
        },
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => (
            <div className="flex justify-center">
                <Button variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        ),
        cell: ({row}) => (
            <div className="text-center text-sm">
                {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({row}) => <ApprovalCell item={row.original}/>,
    },
    {
        id: "delete",
        header: () => <div className="text-center sr-only">Delete</div>,
        cell: ({row}) => <DeleteCell item={row.original}/>,
    },
]
