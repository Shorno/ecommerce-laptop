"use client"

import {useQuery} from "@tanstack/react-query";
import {authClient} from "@/lib/auth-client";
import {getCustomerOrders} from "@/app/(client)/(account)/actions/customer-orders";
import EmptyOrders from "@/app/(client)/(account)/account/orders/_components/empty-order";
import OrdersList from "@/app/(client)/(account)/account/orders/_components/order-list";
import OrdersLoading from "@/app/(client)/(account)/account/orders/_components/orders-skeleton";


export default function OrdersContent() {
    const {data: session, isPending: authPending} = authClient.useSession()

    const {data: orders, isPending} = useQuery({
        queryKey: ['customerOrders'],
        queryFn: getCustomerOrders,
        enabled: !!session?.user?.id
    })

    if (authPending || isPending) {
        return <OrdersLoading/>
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">Please log in to view your orders.</p>
            </div>
        )
    }

    if (!orders || orders.length === 0) {
        return <EmptyOrders/>
    }

    return <OrdersList orders={orders}/>
}
