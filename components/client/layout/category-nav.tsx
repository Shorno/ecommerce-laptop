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
        <div className="hidden lg:block border-b bg-card shadow-sm">
            <div className="container mx-auto">
                <div className="flex items-center gap-1">
                    <Link href="/products">
                        <Button variant="default" className="h-11 gap-2 rounded-none bg-tech-accent hover:bg-tech-accent/90 text-white">
                            <LayoutGrid className="h-4 w-4" />
                            All Products
                        </Button>
                    </Link>

                    <div className="flex items-center gap-0.5 overflow-x-auto">
                        {categories.map((category) => (
                            <Link key={category.name} href={`/products/${category.slug}`}>
                                <Button variant="ghost" className="h-11 gap-2 text-foreground/80 hover:text-tech-accent hover:bg-tech-accent/5 transition-colors">
                                    <div className="relative h-5 w-5 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="whitespace-nowrap text-sm font-medium">{category.name}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
