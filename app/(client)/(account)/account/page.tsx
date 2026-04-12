import type { Metadata } from "next"
import AccountOverview from "@/app/(client)/(account)/account/_components/account-overview"

export const metadata: Metadata = {
    title: "My Account",
    description: "Your account overview — quick access to orders, profile, and settings.",
}

export default function AccountPage() {
    return <AccountOverview />
}
