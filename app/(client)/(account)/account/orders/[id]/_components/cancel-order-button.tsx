"use client"

import { useState, useTransition } from "react"
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
import { XCircle } from "lucide-react"
import { cancelOrder } from "@/app/(client)/(account)/actions/cancel-order"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CancelOrderButtonProps {
    orderId: number
    orderStatus: string
}

export default function CancelOrderButton({ orderId, orderStatus }: CancelOrderButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    // Only show cancel button for pending/confirmed orders
    const isCancellable = ["pending", "confirmed"].includes(orderStatus)

    if (!isCancellable) {
        return null
    }

    const handleCancel = () => {
        startTransition(async () => {
            const result = await cancelOrder(orderId)

            if (result.success) {
                toast.success("Order cancelled", {
                    description: result.message,
                })
                setOpen(false)
                router.refresh()
            } else {
                toast.error("Failed to cancel order", {
                    description: result.error,
                })
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    disabled={isPending}
                >
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The order will be cancelled and the
                        reserved stock will be restored. If you need to place a new order,
                        you&apos;ll need to go through checkout again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Keep Order</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleCancel}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Cancelling..." : "Yes, Cancel Order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
