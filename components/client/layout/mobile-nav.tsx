import Link from "next/link"
import Image from "next/image"
import { LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Category {
    name: string
    slug: string
    image: string
}

interface MobileNavProps {
    categories: Category[]
}

export default function MobileNav({ categories }: MobileNavProps) {
    return (
        <ScrollArea className="h-full py-6">
            <div className="px-4 pb-4">
                <Link href="/products">
                    <Button className="w-full gap-2 mb-4" size="lg">
                        <LayoutGrid className="h-4 w-4" />
                        All Products
                    </Button>
                </Link>

                <div className="w-full space-y-2">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={`/products/${category.slug}`}
                            className="flex items-center gap-3 py-3 px-2 rounded-md hover:bg-accent transition-colors"
                        >
                            <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-medium">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </ScrollArea>
    )
}
