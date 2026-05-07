import Image from "next/image";

interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({className = '', showTagline = true}: LogoProps) {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <Image
                src="/logos/main-logo.png"
                alt="ROWTECH"
                width={40}
                height={40}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
            />
            {showTagline && (
                <span className="text-xs md:text-sm text-muted-foreground">Your Trusted Tech Partner</span>
            )}
        </div>
    );
}
