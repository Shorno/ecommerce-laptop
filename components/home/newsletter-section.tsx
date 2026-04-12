"use client"

import {Mail} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export default function NewsletterSection() {
    return (
        <section className="py-12 md:py-16" id="newsletter-section">
            <div className="custom-container">
                <div className="relative overflow-hidden rounded-2xl bg-tech-navy px-6 py-12 md:px-12 md:py-16">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-tech-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-tech-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"/>

                    <div className="relative flex flex-col items-center text-center max-w-xl mx-auto">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-full bg-tech-accent/20 flex items-center justify-center mb-5">
                            <Mail className="w-6 h-6 text-tech-accent"/>
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Stay Updated with the Latest Deals
                        </h2>
                        <p className="text-sm md:text-base text-white/60 mb-8">
                            Subscribe to our newsletter and never miss out on exclusive offers, new arrivals, and tech updates.
                        </p>

                        {/* Form */}
                        <div className="flex w-full max-w-md gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-tech-accent"
                                id="newsletter-email-input"
                            />
                            <Button
                                type="button"
                                className="h-11 px-6 bg-tech-accent hover:bg-tech-accent/90 text-white font-semibold"
                                id="newsletter-subscribe-btn"
                                onClick={() => {
                                    // Visual only — no action
                                }}
                            >
                                Subscribe
                            </Button>
                        </div>

                        <p className="text-xs text-white/30 mt-4">
                            No spam, unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
