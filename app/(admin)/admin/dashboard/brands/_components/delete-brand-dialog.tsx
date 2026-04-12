"use client"

import * as React from "react"
import {toast} from "sonner"
import {Trash2, Loader} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Brand} from "@/db/schema/brand"
import deleteBrand from "@/app/(admin)/admin/dashboard/brands/action/delete-brand"
import {useMutation, useQueryClient} from "@tanstack/react-query"

interface DeleteBrandDialogProps {
    brand: Brand
}

export default function DeleteBrandDialog({brand: brandItem}: DeleteBrandDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: () => deleteBrand(brandItem.id),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error || "Failed to delete brand.")
                return
            }
            queryClient.invalidateQueries({queryKey: ['admin-brands']})
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred.")
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-destructive hover:text-destructive"
                    aria-label="Delete brand"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Brand</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{brandItem.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
