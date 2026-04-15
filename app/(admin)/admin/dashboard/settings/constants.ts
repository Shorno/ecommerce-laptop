// ─── Setting Keys ───
// Shared constants — NOT a server action file

export const SETTING_KEYS = {
    // General
    STORE_NAME: "store_name",
    STORE_TAGLINE: "store_tagline",
    STORE_DESCRIPTION: "store_description",
    STORE_LOGO_URL: "store_logo_url",
    // Contact
    CONTACT_EMAIL: "contact_email",
    CONTACT_PHONE: "contact_phone",
    SUPPORT_EMAIL: "support_email",
    // Address
    STORE_ADDRESS: "store_address",
    STORE_CITY: "store_city",
    STORE_COUNTRY: "store_country",
    // Shipping
    SHIPPING_FLAT_RATE: "shipping_flat_rate",
    FREE_SHIPPING_THRESHOLD: "free_shipping_threshold",
    // Currency
    CURRENCY_CODE: "currency_code",
    CURRENCY_SYMBOL: "currency_symbol",
    // SEO
    META_TITLE: "meta_title",
    META_DESCRIPTION: "meta_description",
    META_KEYWORDS: "meta_keywords",
    OG_IMAGE_URL: "og_image_url",
    // Social
    SOCIAL_FACEBOOK: "social_facebook",
    SOCIAL_INSTAGRAM: "social_instagram",
    SOCIAL_TWITTER: "social_twitter",
    SOCIAL_YOUTUBE: "social_youtube",
    // Policies
    RETURN_POLICY_DAYS: "return_policy_days",
    // Notifications
    ORDER_EMAIL_ENABLED: "order_email_enabled",
    LOW_STOCK_THRESHOLD: "low_stock_threshold",
} as const

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS]
