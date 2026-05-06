"use client"
import Logo from "@/components/Logo";
import {Button} from "@/components/ui/button";
import {Menu, SearchIcon} from "lucide-react";
import UserButton from "@/components/client/profile/user-button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import MobileNav from "@/components/client/layout/mobile-nav";
import {CategoryWithSubcategories} from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";
import Link from "next/link";
import CartDrawer from "@/components/client/cart/cart-drawer";

import {useState} from "react";
import InlineSearch from "@/components/client/layout/inline-search";

interface NavbarProps {
    categories: CategoryWithSubcategories[]
}

export default function Navbar({categories}: NavbarProps) {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <nav className="bg-tech-navy text-white sticky top-0 z-50">
            <div
                className={"flex container mx-auto max-w-[1400px] justify-start lg:justify-between items-center gap-2 sm:gap-4 h-14 lg:h-16 px-4 lg:px-6"}>
                {/* Mobile/Tablet Menu Button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                        <SheetHeader>
                            <SheetTitle>
                                <Logo/>
                            </SheetTitle>
                        </SheetHeader>
                        <MobileNav categories={categories}/>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href={"/"} className="flex-shrink-0">
                    <Logo showTagline={false}/>
                </Link>

                {/* Desktop Inline Search */}
                <div className="hidden lg:block flex-1 max-w-2xl mx-4">
                    <InlineSearch placeholder="Search for laptops, electronics..."/>
                </div>

                {/* Right side buttons */}
                <div className={"flex justify-center items-center gap-3 ml-auto lg:ml-0"}>
                    {/* Mobile search toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-white hover:bg-white/10"
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    >
                        <SearchIcon className="h-5 w-5"/>
                        <span className="sr-only">Search</span>
                    </Button>

                    <UserButton/>
                    <CartDrawer/>
                </div>
            </div>

            {/* Mobile Search Bar - slides down */}
            {mobileSearchOpen && (
                <div className="lg:hidden border-t border-white/10 px-4 py-2">
                    <InlineSearch placeholder="Search products..."/>
                </div>
            )}
        </nav>
    );
}
