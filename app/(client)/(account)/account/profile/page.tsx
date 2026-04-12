import { Suspense } from "react"
import ProfileContent from "@/components/client/profile/profile-content";
import ProfileSkeleton from "@/components/client/profile/profile-skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile",
    description: "Manage your profile information and account settings.",
};

export default  function  ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Personal Info</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your name, phone number, and shipping address.
                </p>
            </div>
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent/>
            </Suspense>
        </div>
    )
}
