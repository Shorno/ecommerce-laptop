"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
    mainImage: string
    additionalImages?: Array<{ imageUrl: string; id: number }>
    productName: string
}

export function ProductImageGallery({
    mainImage,
    additionalImages = [],
    productName
}: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(mainImage)
    // Limit to 6 images total (main + 5 additional)
    const limitedAdditionalImages = additionalImages.slice(0, 5)
    const allImages = [mainImage, ...limitedAdditionalImages.map(img => img.imageUrl)]

    return (
        <div className="space-y-3">
            {/* Main Image */}
            <Card className="overflow-hidden bg-muted py-0">
                <div className="relative w-full aspect-square max-h-[500px]">
                    <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt={productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>
            </Card>

            {/* Thumbnail Gallery - 6 images in one row on large devices, 2 rows on mobile */}
            {allImages.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {allImages.map((image, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "overflow-hidden py-0 cursor-pointer transition-all hover:ring-2 hover:ring-primary",
                                selectedImage === image && "ring-2 ring-primary"
                            )}
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`${productName} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 33vw, 16vw"
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
