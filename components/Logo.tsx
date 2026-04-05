import { Laptop } from "lucide-react";

interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({className = '', showTagline = true }: LogoProps) {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <div className={`font-bold text-xl sm:text-2xl lg:text-3xl flex items-center gap-1.5`}>
                <Laptop className="w-6 h-6 sm:w-7 sm:h-7 text-tech-accent" />
                <span className="text-tech-navy dark:text-white">Laptop</span>
                <span className="text-tech-accent">BD</span>
            </div>
            {showTagline && (
                <span className="text-xs md:text-sm text-muted-foreground">Your Trusted Tech Partner</span>
            )}
        </div>
    );
}
