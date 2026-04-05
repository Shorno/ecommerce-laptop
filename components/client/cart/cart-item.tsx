import {Badge} from "@/components/ui/badge";
import {Minus, Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {type CartItem, useCartActions} from "@/stote/cart-sotre";
import {formatPrice} from "@/utils/currency";
import {authClient} from "@/lib/auth-client";

interface CartItemProps {
    item: CartItem;
}

export default function CartItem({item}: CartItemProps) {
    const session = authClient.useSession();
    const {increment, decrement, removeItem} = useCartActions();
    const isAuthenticated = !!session.data?.user;

    return (
        <div
            className="flex items-center gap-4 p-4 border-b rounded-xs shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex-shrink-0 relative">
                <div className="relative overflow-hidden rounded-lg border-2">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover"
                    />
                </div>
                {item.quantity > 1 && (
                    <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs font-bold rounded-full border-2"
                    >
                        {item.quantity}
                    </Badge>
                )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-sm font-semibold line-clamp-2">
                    {item.name} <span className="text-muted-foreground font-normal">({item.size})</span>
                </h3>


                <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg bg-muted/50">
                        <Button
                            onClick={() => decrement(item.id, isAuthenticated)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-l-lg rounded-r-none"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3.5 w-3.5"/>
                        </Button>

                        <div
                            className="flex items-center justify-center min-w-[40px] h-8 px-2 text-sm font-medium bg-background border-x">
                            {item.quantity}
                        </div>

                        <Button
                            onClick={() => increment(item.id, isAuthenticated)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-r-lg rounded-l-none"
                        >
                            <Plus className="h-3.5 w-3.5"/>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id, isAuthenticated)}
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            <div className="flex-shrink-0 text-right">
                <p className="text-base font-bold">
                    {formatPrice(item.subtotal)}
                </p>
            </div>
        </div>
    );
}
