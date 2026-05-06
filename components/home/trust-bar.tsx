import {ShieldCheck, Clock, CreditCard, RotateCcw} from "lucide-react"

const trustSignals = [
    {
        icon: ShieldCheck,
        label: "Quality Inspected",
        detail: "Multi-point tested",
    },
    {
        icon: Clock,
        label: "6-Month Warranty",
        detail: "Full coverage",
    },
    {
        icon: CreditCard,
        label: "Secure Checkout",
        detail: "100% protected",
    },
    {
        icon: RotateCcw,
        label: "Easy Returns",
        detail: "Hassle-free policy",
    },
]

export default function TrustBar() {
    return (
        <section className="py-2">
            <div className="custom-container">
                <div className="bg-card border border-border rounded-xl px-4 py-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {trustSignals.map((signal, index) => {
                            const Icon = signal.icon
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 px-2 py-1"
                                >
                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-tech-accent/10 flex items-center justify-center">
                                        <Icon className="w-4.5 h-4.5 text-tech-accent"/>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground leading-tight truncate">
                                            {signal.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-tight">
                                            {signal.detail}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
