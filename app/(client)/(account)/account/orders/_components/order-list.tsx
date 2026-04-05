import OrderCard from "./order-card"
import { type CustomerOrder } from "@/app/(client)/(account)/actions/customer-orders"

interface OrdersListProps {
    orders: CustomerOrder[]
}

export default function OrdersList({ orders }: OrdersListProps) {
    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    )
}
