"use client"

import * as React from "react"
import {toast} from "sonner"
import {Trash2, AlertTriangle} from "lucide-react"

import {Button} from "@/components/ui/button"
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
import {Loader} from "lucide-react"
import deleteProduct from "@/app/(admin)/admin/dashboard/products/actions/delete-product"
import {useMutation, useQueryClient} from "@tanstack/react-query"

interface DeleteProductDialogProps {
    productId: number
    productName: string
}

export default function DeleteProductDialog({productId, productName}: DeleteProductDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    case 404:
                        toast.error("Product not found.")
                        break
                    default:
                        toast.error(result.error || "Failed to delete product.")
                }
                return
            }
            queryClient.invalidateQueries({queryKey: ['admin-products']})
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while deleting the product.")
        },
    })

    const handleDelete = () => {
        mutation.mutate(productId)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4 mr-2"/>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive"/>
                        Delete {productName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        from your inventory.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                        <p className="font-semibold text-destructive mb-1">Warning</p>
                        <p className="text-muted-foreground">
                            All associated product data, including images, will be permanently deleted.
                        </p>
                    </div>
                </div>

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
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Delete Product
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
