"use client"

import {useEffect, useState} from "react"
import {cn} from "@/lib/utils"

interface SectionNavProps {
    sections: { id: string; label: string; count?: number }[]
}

export function SectionNav({sections}: SectionNavProps) {
    const [activeSection, setActiveSection] = useState(sections[0]?.id || "")

    useEffect(() => {
        const handleScroll = () => {
            // Find which section is currently in view
            for (const section of [...sections].reverse()) {
                const element = document.getElementById(section.id)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 140) {
                        setActiveSection(section.id)
                        return
                    }
                }
            }
            setActiveSection(sections[0]?.id || "")
        }

        window.addEventListener("scroll", handleScroll, {passive: true})
        return () => window.removeEventListener("scroll", handleScroll)
    }, [sections])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100 // account for sticky nav
            const y = element.getBoundingClientRect().top + window.scrollY - offset
            window.scrollTo({top: y, behavior: "smooth"})
        }
    }

    return (
        <nav className="sticky top-16 z-30 bg-card border border-border/60 rounded-xl overflow-hidden">
            <div className="flex">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                            "flex-1 px-4 py-3 text-sm font-medium transition-colors text-center whitespace-nowrap",
                            activeSection === section.id
                                ? "bg-tech-accent text-white"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {section.label}
                        {section.count !== undefined && section.count > 0 && (
                            <span className={cn(
                                "ml-1.5 text-xs",
                                activeSection === section.id ? "text-white/70" : "text-muted-foreground/60"
                            )}>
                                ({section.count})
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </nav>
    )
}
