"use client"

import {useState} from "react"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {
    Store, Mail, Phone, MapPin, Truck, Globe,
    Search, Share2, Bell, Save, Loader2, Shield, ImageIcon,
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Switch} from "@/components/ui/switch"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {getAllSettings, updateSettings} from "../actions/settings-actions"
import {SETTING_KEYS} from "../constants"
import {toast} from "sonner"

type SettingsMap = Record<string, string>

function useSettings() {
    return useQuery({
        queryKey: ["admin-settings"],
        queryFn: getAllSettings,
    })
}

function SettingsField({label, settingKey, settings, onChange, type = "text", placeholder, description}: {
    label: string
    settingKey: string
    settings: SettingsMap
    onChange: (key: string, value: string) => void
    type?: "text" | "number" | "email" | "url" | "textarea"
    placeholder?: string
    description?: string
}) {
    const value = settings[settingKey] ?? ""

    if (type === "textarea") {
        return (
            <div className="space-y-1.5">
                <Label className="text-xs font-medium">{label}</Label>
                <Textarea
                    value={value}
                    onChange={(e) => onChange(settingKey, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="text-sm resize-none"
                />
                {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
            </div>
        )
    }

    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium">{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(settingKey, e.target.value)}
                placeholder={placeholder}
                className="h-9 text-sm"
            />
            {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
    )
}

function SwitchField({label, settingKey, settings, onChange, description}: {
    label: string
    settingKey: string
    settings: SettingsMap
    onChange: (key: string, value: string) => void
    description?: string
}) {
    const value = settings[settingKey] === "true"

    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div className="space-y-0.5">
                <Label className="text-xs font-medium">{label}</Label>
                {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
            </div>
            <Switch
                checked={value}
                onCheckedChange={(checked) => onChange(settingKey, checked ? "true" : "false")}
            />
        </div>
    )
}

function ImageField({label, settingKey, settings, onChange, folder, description}: {
    label: string
    settingKey: string
    settings: SettingsMap
    onChange: (key: string, value: string) => void
    folder?: string
    description?: string
}) {
    const value = settings[settingKey] ?? ""

    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium">{label}</Label>
            <ImageUploader
                value={value}
                onChange={(url) => onChange(settingKey, url)}
                folder={folder || "settings"}
                maxSizeMB={2}
                className="min-h-36"
            />
            {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
    )
}

// ─── Section Card ───
function SettingsSection({title, icon: Icon, children}: {
    title: string
    icon: React.ElementType
    children: React.ReactNode
}) {
    return (
        <Card>
            <CardHeader className="p-4 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground"/>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}

export default function SettingsForm() {
    const queryClient = useQueryClient()
    const {data: savedSettings, isLoading} = useSettings()
    const [localSettings, setLocalSettings] = useState<SettingsMap>({})
    const [initialized, setInitialized] = useState(false)

    // Sync from server once
    if (savedSettings && !initialized) {
        setLocalSettings(savedSettings)
        setInitialized(true)
    }

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Settings saved successfully")
                queryClient.invalidateQueries({queryKey: ["admin-settings"]})
            } else {
                toast.error(result.error || "Failed to save settings")
            }
        },
        onError: () => {
            toast.error("An error occurred while saving")
        },
    })

    const handleChange = (key: string, value: string) => {
        setLocalSettings(prev => ({...prev, [key]: value}))
    }

    const handleSave = () => {
        mutation.mutate(localSettings)
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="h-48 bg-muted/50 rounded-lg animate-pulse"/>
                ))}
            </div>
        )
    }

    const K = SETTING_KEYS

    return (
        <div className="space-y-4">
            <Tabs defaultValue="general" className="w-full">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <TabsList className="h-12 p-1.5 rounded-xl">
                        <TabsTrigger value="general" className="text-sm font-medium rounded-lg px-4">General</TabsTrigger>
                        <TabsTrigger value="shipping" className="text-sm font-medium rounded-lg px-4">Shipping</TabsTrigger>
                        <TabsTrigger value="seo" className="text-sm font-medium rounded-lg px-4">SEO & Social</TabsTrigger>
                        <TabsTrigger value="notifications" className="text-sm font-medium rounded-lg px-4">Notifications</TabsTrigger>
                    </TabsList>

                    <Button
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        size="sm"
                        className="gap-1.5"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                        ) : (
                            <Save className="h-3.5 w-3.5"/>
                        )}
                        Save Changes
                    </Button>
                </div>

                {/* ─── General ─── */}
                <TabsContent value="general" className="space-y-3 mt-0">
                    <SettingsSection title="Store Information" icon={Store}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsField label="Store Name" settingKey={K.STORE_NAME}
                                           settings={localSettings} onChange={handleChange}
                                           placeholder="ROWTECH"/>
                            <SettingsField label="Tagline" settingKey={K.STORE_TAGLINE}
                                           settings={localSettings} onChange={handleChange}
                                           placeholder="Premium Laptops & Electronics"/>
                        </div>
                        <SettingsField label="Store Description" settingKey={K.STORE_DESCRIPTION}
                                       settings={localSettings} onChange={handleChange} type="textarea"
                                       placeholder="A brief description of your store..."/>
                        <ImageField label="Store Logo" settingKey={K.STORE_LOGO_URL}
                                    settings={localSettings} onChange={handleChange}
                                    folder="settings/logo"
                                    description="Your store logo. Used in site header and emails."/>
                    </SettingsSection>

                    <SettingsSection title="Contact Information" icon={Mail}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsField label="Contact Email" settingKey={K.CONTACT_EMAIL}
                                           settings={localSettings} onChange={handleChange} type="email"
                                           placeholder="contact@rowtech.com"/>
                            <SettingsField label="Support Email" settingKey={K.SUPPORT_EMAIL}
                                           settings={localSettings} onChange={handleChange} type="email"
                                           placeholder="support@rowtech.com"/>
                        </div>
                        <SettingsField label="Phone Number" settingKey={K.CONTACT_PHONE}
                                       settings={localSettings} onChange={handleChange}
                                       placeholder="+880 1XXXXXXXXX"/>
                    </SettingsSection>

                    <SettingsSection title="Store Address" icon={MapPin}>
                        <SettingsField label="Address" settingKey={K.STORE_ADDRESS}
                                       settings={localSettings} onChange={handleChange}
                                       placeholder="123 Tech Street"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsField label="City" settingKey={K.STORE_CITY}
                                           settings={localSettings} onChange={handleChange}
                                           placeholder="Dhaka"/>
                            <SettingsField label="Country" settingKey={K.STORE_COUNTRY}
                                           settings={localSettings} onChange={handleChange}
                                           placeholder="Bangladesh"/>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Currency" icon={Globe}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsField label="Currency Code" settingKey={K.CURRENCY_CODE}
                                           settings={localSettings} onChange={handleChange}
                                           placeholder="BDT"
                                           description="ISO 4217 code (e.g. BDT, USD)"/>
                            <SettingsField label="Currency Symbol" settingKey={K.CURRENCY_SYMBOL}
                                           settings={localSettings} onChange={handleChange}
                                           placeholder="৳"/>
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* ─── Shipping ─── */}
                <TabsContent value="shipping" className="space-y-3 mt-0">
                    <SettingsSection title="Shipping Rates" icon={Truck}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsField label="Flat Shipping Rate (৳)" settingKey={K.SHIPPING_FLAT_RATE}
                                           settings={localSettings} onChange={handleChange} type="number"
                                           placeholder="0"
                                           description="Applied to all orders. Set 0 for free shipping."/>
                            <SettingsField label="Free Shipping Threshold (৳)" settingKey={K.FREE_SHIPPING_THRESHOLD}
                                           settings={localSettings} onChange={handleChange} type="number"
                                           placeholder="5000"
                                           description="Orders above this amount get free shipping. Leave empty to disable."/>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Policies" icon={Shield}>
                        <SettingsField label="Return Policy (days)" settingKey={K.RETURN_POLICY_DAYS}
                                       settings={localSettings} onChange={handleChange} type="number"
                                       placeholder="7"
                                       description="Number of days customers can request returns."/>
                    </SettingsSection>
                </TabsContent>

                {/* ─── SEO & Social ─── */}
                <TabsContent value="seo" className="space-y-3 mt-0">
                    <SettingsSection title="Search Engine Optimization" icon={Search}>
                        <SettingsField label="Meta Title" settingKey={K.META_TITLE}
                                       settings={localSettings} onChange={handleChange}
                                       placeholder="ROWTECH — Best Laptops in Bangladesh"
                                       description="Displayed in browser tabs and search results. Recommended: 50-60 characters."/>
                        <SettingsField label="Meta Description" settingKey={K.META_DESCRIPTION}
                                       settings={localSettings} onChange={handleChange} type="textarea"
                                       placeholder="Shop premium laptops, accessories, and electronics..."
                                       description="Displayed in search result snippets. Recommended: 150-160 characters."/>
                        <SettingsField label="Meta Keywords" settingKey={K.META_KEYWORDS}
                                       settings={localSettings} onChange={handleChange}
                                       placeholder="laptops, electronics, gaming, Bangladesh"
                                       description="Comma-separated keywords."/>
                        <ImageField label="Open Graph Image" settingKey={K.OG_IMAGE_URL}
                                    settings={localSettings} onChange={handleChange}
                                    folder="settings/og"
                                    description="Image shown when shared on Facebook, Twitter, LinkedIn. Recommended: 1200×630px."/>
                    </SettingsSection>

                    <SettingsSection title="Social Media" icon={Share2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsField label="Facebook" settingKey={K.SOCIAL_FACEBOOK}
                                           settings={localSettings} onChange={handleChange} type="url"
                                           placeholder="https://facebook.com/rowtech"/>
                            <SettingsField label="Instagram" settingKey={K.SOCIAL_INSTAGRAM}
                                           settings={localSettings} onChange={handleChange} type="url"
                                           placeholder="https://instagram.com/rowtech"/>
                            <SettingsField label="Twitter / X" settingKey={K.SOCIAL_TWITTER}
                                           settings={localSettings} onChange={handleChange} type="url"
                                           placeholder="https://x.com/rowtech"/>
                            <SettingsField label="YouTube" settingKey={K.SOCIAL_YOUTUBE}
                                           settings={localSettings} onChange={handleChange} type="url"
                                           placeholder="https://youtube.com/@rowtech"/>
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* ─── Notifications ─── */}
                <TabsContent value="notifications" className="space-y-3 mt-0">
                    <SettingsSection title="Email Notifications" icon={Bell}>
                        <SwitchField label="Order Confirmation Emails"
                                     settingKey={K.ORDER_EMAIL_ENABLED}
                                     settings={localSettings} onChange={handleChange}
                                     description="Send email notifications when new orders are placed."/>
                        <Separator/>
                        <SettingsField label="Low Stock Alert Threshold" settingKey={K.LOW_STOCK_THRESHOLD}
                                       settings={localSettings} onChange={handleChange} type="number"
                                       placeholder="5"
                                       description="Get alerts when product stock falls below this number."/>
                    </SettingsSection>
                </TabsContent>
            </Tabs>
        </div>
    )
}
