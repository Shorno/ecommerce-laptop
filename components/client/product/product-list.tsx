import { ProductCard } from "./product-card"
import getAllProducts from "@/app/actions/products/get-all-products";


export default async function ProductList() {
    const products = await getAllProducts()
    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="bg-gradient-to-b from-neutral-50 to-white px-6 py-16 md:px-12 md:py-24">
                <div className="mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-neutral-900 mb-4 text-balance">
                        Premium Natural Products
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto text-balance">
                        Discover our carefully curated selection of pure honey and premium nuts, sourced from the finest producers
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-6 py-12 md:px-12 md:py-16">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
