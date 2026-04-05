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
import {FeaturedImage} from "@/db/schema";
import {editFeaturedImageSchema} from "@/lib/schemas/featured.scheam";
import updateFeaturedImage from "@/app/(admin)/admin/dashboard/featured/action/update-featured-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditFeaturedImageDialogProps {
    featuredImage: FeaturedImage
}

export default function EditFeaturedImageDialog({featuredImage}: EditFeaturedImageDialogProps) {
    const [open, setOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateFeaturedImage,
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
                        toast.error("Featured image not found.")
                        break
                    default:
                        toast.error(result.error || "Something went wrong.")
                }
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-featured-images'] })
            toast.success(result.message)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while updating.")
        },
    })

    const form = useForm({
        defaultValues: {
            id: featuredImage.id,
            image: featuredImage.image,
            title: featuredImage.title,
            subtitle: featuredImage.subtitle,
            cta: featuredImage.cta,
            ctaLink: featuredImage.ctaLink,
        },
        validators: {
            onSubmit: editFeaturedImageSchema,
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
                    aria-label="Edit featured image"
                    title="Edit"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Featured Image</DialogTitle>
                    <DialogDescription>
                        Update the details of the featured image.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="edit-featured-image-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="image">
                        {(field) => (
                            <Field
                                data-invalid={
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                }>
                                <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                                <ImageUploader
                                    value={field.state.value}
                                    onChange={field.handleChange}
                                    folder="featured-images"
                                    maxSizeMB={5}
                                />
                                <FieldDescription>Upload an image (max 5MB)</FieldDescription>
                                {field.state.meta.isTouched && !field.state.meta.isValid && (
                                    <FieldError errors={field.state.meta.errors}/>
                                )}
                            </Field>
                        )}
                    </form.Field>
                    <form.Field name="title">
                        {(field) => (
                            <Field data-invalid={
                                field.state.meta.isTouched && !field.state.meta.isValid
                            }>
                                <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    }
                                    placeholder="Promo banner"
                                    autoComplete="off"
                                />
                                {field.state.meta.isTouched && !field.state.meta.isValid && (
                                    <FieldError errors={field.state.meta.errors}/>
                                )}
                            </Field>
                        )}
                    </form.Field>
                    <form.Field name="subtitle">
                        {(field) => (
                            <Field data-invalid={
                                field.state.meta.isTouched && !field.state.meta.isValid
                            }>
                                <FieldLabel htmlFor={field.name}>Subtitle</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid
                                    }
                                    placeholder="Subheading (optional)"
                                    autoComplete="off"
                                />
                                {field.state.meta.isTouched && !field.state.meta.isValid && (
                                    <FieldError errors={field.state.meta.errors}/>
                                )}
                            </Field>
                        )}
                    </form.Field>
                    <form.Field name="cta">
                        {(field) => (
                            <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid

                            }>
                                <FieldLabel htmlFor={field.name}>CTA *</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid
                                    }
                                    placeholder="Shop now"
                                    autoComplete="off"
                                />
                                {field.state.meta.isTouched && !field.state.meta.isValid && (
                                    <FieldError errors={field.state.meta.errors}/>
                                )}
                            </Field>
                        )}
                    </form.Field>
                    <form.Field name="ctaLink">
                        {(field) => (
                            <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                                <FieldLabel htmlFor={field.name}>CTA Link *</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid
                                    }
                                    placeholder="https://example.com/shop"
                                    autoComplete="off"
                                />
                                {field.state.meta.isTouched && !field.state.meta.isValid && (
                                    <FieldError errors={field.state.meta.errors}/>
                                )}
                            </Field>
                        )}
                    </form.Field>
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
                    <Button type="submit" form="edit-featured-image-form" disabled={mutation.isPending}>
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Update Featured Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
