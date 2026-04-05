import type {Metadata} from "next";
import {Poppins, Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: {
        template: '%s | LaptopBD',
        default: 'LaptopBD - Your Trusted Tech Partner',
    },
    description: "Shop the latest laptops, electronics, and tech accessories at the best prices in Bangladesh.",
    keywords: ['laptops', 'electronics', 'tech accessories', 'laptop shop Bangladesh', 'buy laptop online'],
    authors: [{ name: 'LaptopBD' }],
    openGraph: {
        title: 'LaptopBD',
        description: 'Shop the latest laptops, electronics, and tech accessories at the best prices in Bangladesh.',
        url: 'http://localhost:3000/',
        siteName: 'LaptopBD',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LaptopBD',
        description: 'Shop the latest laptops, electronics, and tech accessories at the best prices in Bangladesh.',
    },
    robots: {
        index: true,
        follow: true,
    },
    metadataBase: new URL('http://localhost:3000/'),
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
