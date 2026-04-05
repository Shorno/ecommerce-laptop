"use client"
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Category {
    name: string
    slug: string
    image: string
}

interface CategoryNavProps {
    categories: Category[]
}

export default function CategoryNav({ categories }: CategoryNavProps) {
    return (
        <div className="hidden lg:block border-b bg-muted/30">
            <div className="container mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/products">
                        <Button variant="default" className="h-12 gap-2 rounded-none">
                            <LayoutGrid className="h-4 w-4" />
                            All Products
                        </Button>
                    </Link>

                    <div className="flex items-center gap-1">
                        {categories.map((category) => (
                            <Link key={category.name} href={`/products/${category.slug}`}>
                                <Button variant="ghost" className="h-12 gap-2">
                                    <div className="relative h-5 w-5 rounded-full overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {category.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
