'use client';

import Link from 'next/link';
import { Mail, Phone, Facebook } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Logo from "@/components/Logo";

export function Footer() {
    return (
        <footer className="bg-tech-navy text-white/80 mt-16">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-10 md:py-14">
                <div className="flex flex-col gap-8 md:gap-10">
                    {/* Top Brand & Contact Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Brand Column */}
                        <div className="flex flex-col gap-4">
                            <Logo showTagline={false} />
                            <p className="text-sm text-white/60 leading-relaxed">
                                Your trusted online destination for laptops, electronics, and tech accessories.
                            </p>

                            {/* Contact Information */}
                            <div className="flex flex-col gap-3 mt-2">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-tech-accent flex-shrink-0" />
                                    <a
                                        href="tel:+8801618106224"
                                        className="text-sm text-white/70 hover:text-tech-accent transition-colors"
                                    >
                                        +880 1618-106224
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-tech-accent flex-shrink-0" />
                                    <a
                                        href="mailto:support@laptopbd.com"
                                        className="text-sm text-white/70 hover:text-tech-accent transition-colors"
                                    >
                                        support@laptopbd.com
                                    </a>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61580888133077#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-tech-accent flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links & Support */}
                        <div className="md:col-span-2 flex justify-between md:justify-end md:gap-20 lg:gap-28">
                            {/* Quick Links */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Quick Links</h3>
                                <nav className="flex flex-col gap-2.5">
                                    <Link href="/" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        Home
                                    </Link>
                                    <Link href="/products" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        Products
                                    </Link>
                                    <Link href="/about" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        About Us
                                    </Link>
                                    <Link href="/contact" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        Contact
                                    </Link>
                                </nav>
                            </div>

                            {/* Support Links */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Support</h3>
                                <nav className="flex flex-col gap-2.5">
                                    <Link href="/faq" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        FAQ
                                    </Link>
                                    <Link href="/shipping" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        Shipping Info
                                    </Link>
                                    <Link href="/returns" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        Returns
                                    </Link>
                                    <Link href="/privacy" className="text-sm text-white/60 hover:text-tech-accent transition-colors">
                                        Privacy Policy
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Bottom Section */}
                    <p className="text-xs text-white/40 text-center">
                        &copy; {new Date().getFullYear()} LaptopBD. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
