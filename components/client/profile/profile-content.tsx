"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {useQuery} from "@tanstack/react-query";
import {authClient} from "@/lib/auth-client";
import {getCustomerInfo} from "@/app/(client)/(account)/actions/customer-info";
import EditableAddressForm from "@/components/client/profile/editable-address-form";
import ProfileSkeleton from "@/components/client/profile/profile-skeleton";

export default function ProfileContent() {
    const {data : session, isPending: authPending} = authClient.useSession()

    const {data : customerInfo, isPending} = useQuery({
        queryKey: ['customerInfo'],
        queryFn : getCustomerInfo,
        enabled: !!session?.user?.id
    })

    if (authPending || isPending) {
        return (
            <ProfileSkeleton/>
        )
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">Please log in to view your profile.</p>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
                <EditableAddressForm customerInfo={customerInfo || null} user={session?.user} />
        </div>
    )
}
