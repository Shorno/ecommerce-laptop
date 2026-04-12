import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatPrice } from "@/utils/currency"

interface OrderItem {
    id: number
    productImage: string | null
    productName: string
    productSize: string
    quantity: number
    unitPrice: string
    subtotal: string
}

interface OrderItemsSectionProps {
    items: OrderItem[]
}

export default function OrderItemsSection({ items }: OrderItemsSectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Section header */}
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground">
                    Items Ordered ({items.length})
                </h2>
            </div>

            {/* Item list */}
            <div className="divide-y divide-border">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 sm:px-6 sm:py-5">
                        {/* Product image */}
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-muted overflow-hidden shrink-0">
                            {item.productImage ? (
                                <Image
                                    src={item.productImage}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>

                        {/* Product details */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-2 sm:line-clamp-1">
                                {item.productName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Variant: {item.productSize}
                            </p>

                            {/* Mobile: price row below */}
                            <div className="flex items-center justify-between mt-2 sm:hidden">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Qty:</span>
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0">{item.quantity}</Badge>
                                </div>
                                <p className="text-sm font-bold text-foreground">
                                    {formatPrice(parseFloat(item.subtotal))}
                                </p>
                            </div>
                        </div>

                        {/* Desktop: quantity + price columns */}
                        <div className="hidden sm:flex items-start gap-8">
                            <div className="text-center">
                                <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-semibold mb-1">Qty</p>
                                <Badge variant="secondary">{item.quantity}</Badge>
                            </div>
                            <div className="text-center min-w-[80px]">
                                <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-semibold mb-1">Price</p>
                                <p className="text-sm text-foreground">{formatPrice(parseFloat(item.unitPrice))}</p>
                            </div>
                            <div className="text-right min-w-[90px]">
                                <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-semibold mb-1">Subtotal</p>
                                <p className="text-sm font-bold text-foreground">{formatPrice(parseFloat(item.subtotal))}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
