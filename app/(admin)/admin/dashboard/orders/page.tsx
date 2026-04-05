import OrderList from "@/app/(admin)/admin/dashboard/orders/_components/order-list";
import {getTranslations} from 'next-intl/server';


export default async function OrdersPage() {
    const t = await getTranslations('orders');

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <OrderList/>
        </div>
    )
}