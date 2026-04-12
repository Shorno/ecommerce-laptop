"use client"

import * as React from "react"
import {useForm} from "@tanstack/react-form"
import {toast} from "sonner"
import {Pencil, Loader} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import ImageUploader from "@/components/ImageUploader"
import {Brand} from "@/db/schema/brand"
import {editBrandSchema} from "@/lib/schemas/brand.schema"
import updateBrand from "@/app/(admin)/admin/dashboard/brands/action/update-brand"
import {useMutation, useQueryClient} from "@tanstack/react-query"

interface EditBrandDialogProps {
    brand: Brand
}

export default function EditBrandDialog({brand: brandItem}: EditBrandDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateBrand,
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 400:
                        toast.error("Invalid data.", {description: "Please check your form inputs."})
                        break
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    case 404:
                        toast.error("Brand not found.")
                        break
                    default:
                        toast.error(result.error || "Something went wrong.")
                }
                return
            }
            queryClient.invalidateQueries({queryKey: ['admin-brands']})
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while updating.")
        },
    })

    const form = useForm({
        defaultValues: {
            id: brandItem.id,
            name: brandItem.name,
            slug: brandItem.slug,
            logo: brandItem.logo,
            isActive: brandItem.isActive,
            displayOrder: brandItem.displayOrder,
        },
        validators: {
            onSubmit: editBrandSchema,
        },
        onSubmit: async ({value}) => {
            mutation.mutate(value)
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-2"
                    aria-label="Edit brand"
                    title="Edit"
                >
                    <Pencil className="w-4 h-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                    <DialogDescription>
                        Update the details of this brand.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="edit-brand-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column — Logo */}
                        <div>
                            <form.Field name="logo">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Brand Logo</FieldLabel>
                                            <ImageUploader
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                folder="brands"
                                                maxSizeMB={2}
                                            />
                                            <FieldDescription>Upload a logo image (max 2MB)</FieldDescription>
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        {/* Right Column — Details */}
                        <div className="space-y-4">
                            <form.Field name="name">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="e.g. Lenovo"
                                                autoComplete="off"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>

                            <form.Field name="slug">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Slug *</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="brand-slug"
                                                autoComplete="off"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>

                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="displayOrder">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Display Order</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                                    aria-invalid={isInvalid}
                                                    placeholder="0"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-brand-form" disabled={mutation.isPending}>
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Update Brand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
