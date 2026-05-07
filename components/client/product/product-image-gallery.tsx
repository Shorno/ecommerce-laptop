"use client"

import { useState } from "react"
import Image from "next/image"
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
            <div className="relative w-full aspect-square max-h-[520px] rounded-xl overflow-hidden bg-white">
                <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt={productName}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            className={cn(
                                "relative flex-shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-lg overflow-hidden bg-white border-2 transition-all duration-200",
                                selectedImage === image
                                    ? "border-tech-accent ring-1 ring-tech-accent/20"
                                    : "border-transparent hover:border-border opacity-70 hover:opacity-100"
                            )}
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image || "/placeholder.svg"}
                                alt={`${productName} - Image ${index + 1}`}
                                fill
                                className="object-contain p-1"
                                sizes="72px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
