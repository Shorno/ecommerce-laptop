import Image from "next/image"
import { Package } from "lucide-react"

interface OrderItem {
    id: number
    productName: string
    productImage: string
    quantity: number
}

interface OrderItemsPreviewProps {
    items: OrderItem[]
}

export default function OrderItemsPreview({ items }: OrderItemsPreviewProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {items.slice(0, 4).map((item) => (
                <div
                    key={item.id}
                    className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md bg-muted overflow-hidden"
                >
                    {item.productImage ? (
                        <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                    )}
                    {item.quantity > 1 && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            x{item.quantity}
                        </div>
                    )}
                </div>
            ))}
            {items.length > 4 && (
                <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                        +{items.length - 4}
                    </span>
                </div>
            )}
        </div>
    )
}
