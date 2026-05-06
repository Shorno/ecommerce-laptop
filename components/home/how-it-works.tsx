import {Search, CheckCircle2, Truck} from "lucide-react"

const steps = [
    {
        icon: Search,
        step: "01",
        title: "Sourced & Selected",
        description: "We handpick every device from trusted suppliers, ensuring only the best units make the cut.",
    },
    {
        icon: CheckCircle2,
        step: "02",
        title: "Inspected & Tested",
        description: "Each device goes through rigorous multi-point quality checks — battery, display, performance, and more.",
    },
    {
        icon: Truck,
        step: "03",
        title: "Certified & Shipped",
        description: "Protected by our warranty and carefully packaged, your device is delivered right to your door.",
    },
]

export default function HowItWorks() {
    return (
        <section className="py-12 md:py-16" id="how-it-works">
            <div className="custom-container">
                <div className="relative overflow-hidden rounded-2xl bg-tech-navy px-6 py-12 md:px-12 md:py-16">
                    {/* Decorative bg elements */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-tech-accent/5 rounded-full blur-3xl -translate-y-1/2"/>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-tech-accent/5 rounded-full blur-3xl translate-y-1/2"/>

                    <div className="relative">
                        {/* Section Header */}
                        <div className="text-center mb-10 md:mb-14">
                            <p className="text-tech-accent text-sm font-semibold uppercase tracking-widest mb-2">
                                Our Process
                            </p>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                                How We Deliver Quality
                            </h2>
                            <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
                                Every device in our store goes through a meticulous 3-step process to ensure you get premium quality at unbeatable prices.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
                            {steps.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div key={index} className="relative flex flex-col items-center text-center group">
                                        {/* Connector line (desktop only, between steps) */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-white/20 to-transparent"/>
                                        )}

                                        {/* Icon Circle */}
                                        <div className="relative mb-5">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-tech-accent/10 group-hover:border-tech-accent/30 transition-all duration-300">
                                                <Icon className="w-7 h-7 text-tech-accent"/>
                                            </div>
                                            <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-tech-accent text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-tech-accent/30">
                                                {item.step}
                                            </span>
                                        </div>

                                        {/* Text */}
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                                            {item.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
