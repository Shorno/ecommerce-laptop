'use client';

import Link from 'next/link';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-16">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="flex flex-col gap-8 md:gap-12">
                    {/* Top Brand & Contact Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Brand Column - Left */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                    <Image  src={"/logos/site-logo.png"} alt={"KhaatiBazar-logo"} width={50} height={50} />
                                </div>
                                <h2 className="font-bold text-lg text-foreground">KhaatiBazar Shop</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Your trusted online shopping destination for organic and natural products.
                            </p>

                            {/* Contact Information */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <a
                                        href="tel:+8801618106224"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        +880 1618-106224
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <a
                                        href="mailto:support@ecommerce.com"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        support@khaatibazar.com
                                    </a>
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-4 pt-2">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61580888133077#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links & Support - Mobile: justify-between, Desktop: wider with justify-end */}
                        <div className="md:col-span-2 flex justify-between md:justify-end md:gap-24 lg:gap-32">
                            {/* Quick Links */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-foreground">Quick Links</h3>
                                <nav className="flex flex-col gap-2">
                                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Home
                                    </Link>
                                    <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Products
                                    </Link>
                                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        About Us
                                    </Link>
                                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Contact
                                    </Link>
                                </nav>
                            </div>

                            {/* Support Links */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-foreground">Support</h3>
                                <nav className="flex flex-col gap-2">
                                    <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        FAQ
                                    </Link>
                                    <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Shipping Info
                                    </Link>
                                    <Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Returns
                                    </Link>
                                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Privacy Policy
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <Separator />

                    {/* Bottom Section */}
                    <p className="text-xs text-muted-foreground text-center">
                        &copy; 2025 KhaatiBazar. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
