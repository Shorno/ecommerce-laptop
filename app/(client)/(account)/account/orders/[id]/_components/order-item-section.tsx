import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
        <Card>
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
                {/* Mobile View */}
                <div className="sm:hidden space-y-4 px-4">
                    {items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex gap-3">
                                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden relative shrink-0">
                                    {item.productImage ? (
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">Size: {item.productSize}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <Badge variant="secondary" className="ml-2">{item.quantity}</Badge>
                                </div>
                                <div className="text-right">
                                    <span className="text-muted-foreground">Price:</span>
                                    <span className="ml-2 font-medium">
                                        {formatPrice(parseFloat(item.unitPrice))}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">
                                    {formatPrice(parseFloat(item.subtotal))}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Product</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden relative">
                                            {item.productImage ? (
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Size: {item.productSize}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{item.quantity}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatPrice(parseFloat(item.unitPrice))}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatPrice(parseFloat(item.subtotal))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
