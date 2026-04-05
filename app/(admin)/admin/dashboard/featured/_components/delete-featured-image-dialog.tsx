"use client"

import * as React from "react"
import { toast } from "sonner"
import { Trash2, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { FeaturedImage } from "@/db/schema";
import deleteFeaturedImage from "@/app/(admin)/admin/dashboard/featured/action/delete-featured-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteFeaturedImageDialogProps {
    featuredImage: FeaturedImage
}

export default function DeleteFeaturedImageDialog({ featuredImage }: DeleteFeaturedImageDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: number) => deleteFeaturedImage(id),
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    case 404:
                        toast.error("Featured image not found.")
                        break
                    default:
                        toast.error(result.error || "Failed to delete featured image.")
                }
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-featured-images'] })
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while deleting the featured image.")
        },
    })

    const handleDelete = () => {
        mutation.mutate(featuredImage.id)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-destructive"
                    aria-label="Delete featured image"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete {featuredImage.title}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the featured image.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={mutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {mutation.isPending && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                        Delete Featured Image
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
