"use client"
import Logo from "@/components/Logo";
import {Button} from "@/components/ui/button";
import {SearchIcon, Menu} from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import UserButton from "@/components/client/profile/user-button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import MobileNav from "@/components/client/layout/mobile-nav";
import {CategoryWithSubcategories} from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";
import Link from "next/link";
import CartDrawer from "@/components/client/cart/cart-drawer";
import {ModeToggle} from "@/components/mode-toggle";
import {useState} from "react";
import SearchModal from "@/components/client/layout/search-modal";

interface NavbarProps {
    categories: CategoryWithSubcategories[]
}

export default function Navbar({categories}: NavbarProps) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
            <nav className="bg-tech-navy text-white sticky top-0 z-50">
                <div
                    className={"flex container mx-auto justify-start lg:justify-between items-center gap-2 sm:gap-4 h-14 lg:h-16 px-4 lg:px-0"}>
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

                    {/* Desktop Search */}
                    <div
                        className={"hidden lg:flex flex-1 max-w-2xl h-10 rounded-md cursor-pointer"}
                        onClick={() => setSearchOpen(true)}
                    >
                        <InputGroup className={"w-full h-10 rounded-md border-white/20 bg-white/10"}>
                            <InputGroupInput placeholder="Search for laptops, electronics..." readOnly className="text-white placeholder:text-white/50 border-0 bg-transparent" />
                            <InputGroupAddon className="bg-tech-accent border-0 text-white rounded-r-md px-4">
                                <SearchIcon className="h-4 w-4"/>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    {/* Right side buttons */}
                    <div className={"flex justify-center items-center gap-3 ml-auto lg:ml-0"}>
                        <div className={"hidden md:block"}>
                            <ModeToggle/>
                        </div>
                        <UserButton/>
                        <CartDrawer/>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="lg:hidden border-t border-white/10 px-4 py-2">
                    <div
                        className={"w-full cursor-pointer"}
                        onClick={() => setSearchOpen(true)}
                    >
                        <InputGroup className={"w-full h-10 rounded-md bg-white/10 border-white/20"}>
                            <InputGroupInput placeholder="Search..." readOnly className="text-white placeholder:text-white/50 border-0 bg-transparent" />
                            <InputGroupAddon className="bg-tech-accent border-0 text-white rounded-r-md">
                                <SearchIcon className="h-4 w-4"/>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
            </nav>
        </>
    );
}
