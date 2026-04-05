interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({className = '', showTagline = true }: LogoProps) {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <div className={`font-bold text-xl sm:text-2xl lg:text-3xl text-primary`}>
                <span className="text-green-600">Khaati</span>
                <span className="text-orange-500"> Bazar</span>
                <span className="text-white"> Shop</span>
            </div>
            {showTagline && (
                <span className="text-xs md:text-sm text-gray-500">বিশুদ্ধতায় আপোষহীন</span>
            )}
        </div>
    );
}
