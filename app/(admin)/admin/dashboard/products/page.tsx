import ProductList from "@/app/(admin)/admin/dashboard/products/_components/product-list";
import {getTranslations} from 'next-intl/server';


export default async function ProductsPage() {
    const t = await getTranslations('products');

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <ProductList/>
        </div>
    )
}