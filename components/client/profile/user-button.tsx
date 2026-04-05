import {User, LogOut, ShoppingBag, UserCircle, LayoutDashboard, LogIn, UserPlus} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import {authClient} from "@/lib/auth-client";
import type {LucideIcon} from "lucide-react";
import {useRouter} from "next/navigation";

type NavigationItem = {
    label: string;
    href?: string;
    icon: LucideIcon;
    onClick?: () => void;
    variant?: "default" | "destructive";
};

export default function UserButton() {
    const {data, isPending} = authClient.useSession();
    const router = useRouter()

    if (isPending) {
        return <Skeleton className="size-7 rounded-full"/>;
    }

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.refresh()
                    router.push("/")
                }
            }
        });


    };

    const isLoggedIn = !!data?.user;
    const isAdmin = data?.user?.role === "admin";

    const authNavItems: NavigationItem[] = [
        {
            label: "Login",
            href: "/login",
            icon: LogIn,
        },
        {
            label: "Sign Up",
            href: "/signup",
            icon: UserPlus,
        },
    ];

    const adminNavItems: NavigationItem[] = [
        {
            label: "Dashboard",
            href: "/admin/dashboard/orders",
            icon: LayoutDashboard,
        },
    ];

    const userNavItems: NavigationItem[] = [
        {
            label: "My Orders",
            href: "/account/orders",
            icon: ShoppingBag,
        },
        {
            label: "Profile",
            href: "/account/profile",
            icon: UserCircle,
        },
    ];

    const logoutItem: NavigationItem = {
        label: "Logout",
        icon: LogOut,
        onClick: handleLogout,
        variant: "destructive",
    };

    let navigationItems: NavigationItem[] = [];

    if (!isLoggedIn) {
        navigationItems = [...authNavItems, ...userNavItems];
    } else if (isAdmin) {
        navigationItems = adminNavItems;
    } else {
        navigationItems = userNavItems;
    }

    return (
        <DropdownMenu key={data?.user?.email || "guest"}>
            <DropdownMenuTrigger asChild>
                <Avatar className="size-7 cursor-pointer">
                    {data?.user ? (
                        <>
                            <AvatarImage src={data.user.image || ""}/>
                            <AvatarFallback>{data.user.name?.[0]}</AvatarFallback>
                        </>
                    ) : (
                        <AvatarFallback>
                            <User className="h-4 w-4"/>
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                {data?.user && (
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{data.user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {data.user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                    </>
                )}

                {navigationItems.map((item, index) => (
                    <div key={item.label}>
                        <DropdownMenuItem asChild={!!item.href}>
                            {item.href ? (
                                <Link href={item.href} className="cursor-pointer">
                                    <item.icon className="mr-2 h-4 w-4"/>
                                    {item.label}
                                </Link>
                            ) : (
                                <div onClick={item.onClick} className="cursor-pointer">
                                    <item.icon className="mr-2 h-4 w-4"/>
                                    {item.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                        {index < navigationItems.length - 1 && <DropdownMenuSeparator/>}
                    </div>
                ))}

                {isLoggedIn && (
                    <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={logoutItem.onClick}
                            className="cursor-pointer text-red-600"
                        >
                            <logoutItem.icon className="mr-2 h-4 w-4"/>
                            {logoutItem.label}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
