"use client"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {ShoppingCart} from "lucide-react";
import Link from "next/link";
import {useCartItems, useCartTotalPrice, useCartTotalQuantity} from "@/stote/cart-sotre";
import CartItem from "@/components/client/cart/cart-item";
import {formatPrice} from "@/utils/currency";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";


export default function CartDrawer() {
    const session = authClient.useSession()

    const router = useRouter()
    const cartItems = useCartItems()
    const totalQuantity = useCartTotalQuantity()
    const subtotal = useCartTotalPrice()

    const handleCheckoutClick = () => {
        if (!session.data?.user) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    }


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5"/>
                    {totalQuantity > 0 && (
                        <span
                            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalQuantity}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-serif">Cart</SheetTitle>
                    </div>
                </SheetHeader>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto">
                    {totalQuantity === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <h3 className="text-xl font-medium mb-6">Your cart is empty</h3>
                            <SheetClose asChild>
                                <Button
                                    className="px-8 rounded-full"
                                    asChild
                                >
                                    <Link href="/">CONTINUE SHOPPING</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <div className="overflow-auto">
                            {cartItems.map((item, index) => (
                                <CartItem item={item} key={`${item.id}-${index}`}/>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-medium">SUBTOTAL</span>
                            <span className="font-bold">{formatPrice(subtotal)}</span>
                        </div>

                        <SheetClose asChild>
                            <Button
                                onClick={handleCheckoutClick}
                                className="w-full py-6 rounded-full text-base"
                                disabled={totalQuantity === 0}
                            >
                                CHECKOUT
                            </Button>
                        </SheetClose>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
