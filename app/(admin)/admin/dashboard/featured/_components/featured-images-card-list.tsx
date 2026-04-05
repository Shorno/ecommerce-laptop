"use client"

import React from "react"
import Image from "next/image"
import getFeaturedImages from "@/app/(admin)/admin/dashboard/featured/action/get-featured-images"
import EditFeaturedImageDialog from "@/app/(admin)/admin/dashboard/featured/_components/edit-featured-image-dialog"
import DeleteFeaturedImageDialog from "@/app/(admin)/admin/dashboard/featured/_components/delete-featured-image-dialog"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedImagesCardList() {
    const { data: featuredImages = [], isLoading } = useQuery({
        queryKey: ['admin-featured-images'],
        queryFn: getFeaturedImages,
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredImages.map((featured) => (
                <div
                    key={featured.id}
                    className="relative rounded-xl overflow-hidden bg-white shadow-md flex flex-col justify-between h-80"
                >
                    <Image
                        src={featured.image || "/placeholder.svg"}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                        <EditFeaturedImageDialog featuredImage={featured}/>
                        <DeleteFeaturedImageDialog featuredImage={featured}/>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 px-8 text-center text-white">
                        <h3 className="text-3xl md:text-4xl font-extrabold mb-2">
                            {featured.title}
                        </h3>
                        {featured.subtitle && (
                            <p className="mb-4 text-lg font-medium">
                                {featured.subtitle}
                            </p>
                        )}
                        <a
                            href={featured.ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-gray-900 font-semibold rounded-full px-6 py-2 text-lg shadow"
                        >
                            {featured.cta}
                        </a>
                    </div>
                </div>
            ))}
        </div>
    )
}
