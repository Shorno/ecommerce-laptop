import {getActiveFlashSale} from "@/app/actions/flash-sale/get-flash-sale"
import FlashSaleClient from "./flash-sale-client"

export default async function FlashSaleSection() {
    const sale = await getActiveFlashSale()

    if (!sale || sale.products.length === 0) return null

    return <FlashSaleClient sale={sale}/>
}
