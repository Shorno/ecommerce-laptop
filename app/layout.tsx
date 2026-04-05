import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";


const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: {
        template: '%s | KhaatiBazar Shop',
        default: 'KhaatiBazar Shop',
    },
    description: "Organic products shop.",
    keywords: ['organic products', 'natural foods', 'healthy living', 'organic shop'],
    authors: [{ name: 'KhaatiBazar' }],
    openGraph: {
        title: 'KhaatiBazar',
        description: 'Organic products shop.',
        url: 'https://www.khaatibazar.shop/',
        siteName: 'KhaatiBazar',
        images: [
            {
                url: 'https://res.cloudinary.com/def3zwztt/image/upload/v1762872083/featured-images/ypknsea7usqqcxhvn6nq.jpg',
                width: 1200,
                height: 630,
                alt: 'KhaatiBazar - Organic products shop',
            },
        ],
        locale: 'bn_BD',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KhaatiBazar',
        description: 'Organic products shop.',
        images: ['https://res.cloudinary.com/def3zwztt/image/upload/v1762872083/featured-images/ypknsea7usqqcxhvn6nq.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
    metadataBase: new URL('https://www.khaatibazar.shop/'),
}


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
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
