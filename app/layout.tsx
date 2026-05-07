import type {Metadata} from "next";
import {Poppins, Geist} from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import {cn} from "@/lib/utils";
import {db} from "@/db/config";
import {storeSetting} from "@/db/schema/store-setting";

const geist = Geist({subsets: ['latin'], variable: '--font-sans'});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

// Helper to load settings once (cached per request via React cache)
async function getSettings(): Promise<Record<string, string>> {
    try {
        const rows = await db.select().from(storeSetting)
        const map: Record<string, string> = {}
        for (const r of rows) map[r.key] = r.value
        return map
    } catch {
        return {}
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const s = await getSettings()

    const storeName = s.store_name || "ROWTECH"
    const tagline = s.store_tagline || "Your Trusted Tech Partner"
    const metaTitle = s.meta_title || `${storeName} — ${tagline}`
    const metaDescription = s.meta_description || "Shop the latest laptops, electronics, and tech accessories at the best prices in Bangladesh."
    const metaKeywords = s.meta_keywords
        ? s.meta_keywords.split(",").map(k => k.trim())
        : ["laptops", "electronics", "tech accessories", "laptop shop Bangladesh", "buy laptop online"]
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const ogImage = s.og_image_url || s.store_logo_url || undefined

    return {
        // ─── Core ───
        title: {
            template: `%s | ${storeName}`,
            default: metaTitle,
        },
        description: metaDescription,
        keywords: metaKeywords,
        authors: [{name: storeName}],
        creator: storeName,
        publisher: storeName,
        applicationName: storeName,

        // ─── Format detection ───
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },

        // ─── Canonical & alternates ───
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: "/",
        },

        // ─── Open Graph ───
        openGraph: {
            type: "website",
            locale: "en_US",
            url: siteUrl,
            siteName: storeName,
            title: metaTitle,
            description: metaDescription,
            ...(ogImage && {
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: `${storeName} — ${tagline}`,
                    },
                ],
            }),
        },

        // ─── Twitter / X ───
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            ...(s.social_twitter && {site: s.social_twitter}),
            ...(ogImage && {
                images: [ogImage],
            }),
        },

        // ─── Robots ───
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        // ─── Category (for App Store / search engines) ───
        category: "E-Commerce",
    }
}


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
        <body
            className={`${poppins.className} antialiased`}
        >
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
