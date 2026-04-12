import {Truck, ShieldCheck, RotateCcw, Award} from "lucide-react"

const valueProps = [
    {
        icon: Truck,
        title: "Free Delivery",
        description: "Free shipping in Dhaka",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        description: "100% secure checkout",
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        description: "Hassle-free returns",
    },
    {
        icon: Award,
        title: "Official Warranty",
        description: "Genuine products only",
    },
]

export default function ValueProps() {
    return (
        <section className="py-8 md:py-12" id="value-propositions">
            <div className="custom-container">
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {valueProps.map((prop, index) => {
                            const Icon = prop.icon
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center gap-3"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-tech-accent/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-tech-accent"/>
                                    </div>
                                    <div>
                                        <h3 className="text-sm md:text-base font-semibold text-foreground">
                                            {prop.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                                            {prop.description}
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
