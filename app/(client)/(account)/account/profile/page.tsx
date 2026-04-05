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
        <div>
            <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent/>
            </Suspense>
        </div>
    )
}
