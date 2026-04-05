export const PAYMENT_CONFIG = {
    bKash: {
        logo: "/logos/bkash.png",
        name: "bKash",
        color: "bg-[#E2136E]",
        dialCode: "*247#",
        merchantNumber: "01344656039",
    },
    rocket: {
        logo: "/logos/rocket.png",
        name: "Rocket",
        color: "bg-[#8B3A94]",
        dialCode: "*322#",
        merchantNumber: "01344656039",
    }
} as const;

export const MERCHANT_INFO = {
    name: "KhaatiBazar",
    logo: "/images/site-logo.png",
} as const;
