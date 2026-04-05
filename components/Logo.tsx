import { Laptop } from "lucide-react";

interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({className = '', showTagline = true }: LogoProps) {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <div className={`font-bold text-xl sm:text-2xl lg:text-3xl flex items-center gap-1.5`}>
                <Laptop className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                <span className="text-blue-500">Laptop</span>
                <span className="text-slate-700 dark:text-slate-200">BD</span>
            </div>
            {showTagline && (
                <span className="text-xs md:text-sm text-gray-500">Your Trusted Tech Partner</span>
            )}
        </div>
    );
}
