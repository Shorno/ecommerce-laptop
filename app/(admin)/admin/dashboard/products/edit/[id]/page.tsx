import EditProductForm from "./_components/edit-product-form"
import getProductById from "@/app/(admin)/admin/dashboard/products/actions/get-product-by-id"
import {notFound} from "next/navigation"

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({params}: EditProductPageProps) {
    const {id} = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
        notFound()
    }

    const product = await getProductById(productId)

    if (!product) {
        notFound()
    }

    return <EditProductForm product={product}/>
}
