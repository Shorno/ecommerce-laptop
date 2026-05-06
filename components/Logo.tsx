import Image from "next/image";

interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({className = '', showTagline = true }: LogoProps) {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <div className={`font-bold text-xl sm:text-2xl lg:text-3xl flex items-center gap-1.5`}>
                <Image
                    src="/logos/Raw.png"
                    alt="ROWTECH"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
                <span className="text-current">ROW</span>
                <span className="text-tech-accent">TECH</span>
            </div>
            {showTagline && (
                <span className="text-xs md:text-sm text-muted-foreground">Your Trusted Tech Partner</span>
            )}
        </div>
    );
}
