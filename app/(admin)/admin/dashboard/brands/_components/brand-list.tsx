"use client"

import React from "react"
import Image from "next/image"
import getBrands from "@/app/(admin)/admin/dashboard/brands/action/get-brands"
import EditBrandDialog from "@/app/(admin)/admin/dashboard/brands/_components/edit-brand-dialog"
import DeleteBrandDialog from "@/app/(admin)/admin/dashboard/brands/_components/delete-brand-dialog"
import {Badge} from "@/components/ui/badge"
import {useQuery} from "@tanstack/react-query"
import {Skeleton} from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function BrandList() {
    const {data: brands = [], isLoading} = useQuery({
        queryKey: ['admin-brands'],
        queryFn: getBrands,
    })

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg"/>
                ))}
            </div>
        )
    }

    if (brands.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">No brands yet</p>
                <p className="text-sm mt-1">Add your first brand to display on the homepage.</p>
            </div>
        )
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-20">Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="w-24 text-center">Order</TableHead>
                        <TableHead className="w-24 text-center">Status</TableHead>
                        <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map((b) => (
                        <TableRow key={b.id}>
                            <TableCell>
                                <div className="relative w-14 h-10 bg-muted rounded">
                                    <Image
                                        src={b.logo}
                                        alt={b.name}
                                        fill
                                        className="object-contain p-1"
                                        sizes="56px"
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{b.slug}</TableCell>
                            <TableCell className="text-center text-sm">{b.displayOrder}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={b.isActive ? "default" : "secondary"} className="text-xs">
                                    {b.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <EditBrandDialog brand={b}/>
                                    <DeleteBrandDialog brand={b}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
