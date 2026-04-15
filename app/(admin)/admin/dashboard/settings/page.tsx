import SettingsForm from "@/app/(admin)/admin/dashboard/settings/_components/settings-form"
import type {Metadata} from "next"

export const metadata: Metadata = {
    title: "Settings — Admin",
    description: "Configure your store settings, shipping, SEO, and more.",
}

export default function SettingsPage() {
    return (
        <div>
            <div className="mb-4">
                <h1 className="text-lg font-semibold">Store Settings</h1>
                <p className="text-xs text-muted-foreground">
                    Configure your store information, shipping, SEO, and notification preferences.
                </p>
            </div>
            <SettingsForm/>
        </div>
    )
}
