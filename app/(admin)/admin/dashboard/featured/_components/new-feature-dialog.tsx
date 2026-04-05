"use client"

import * as React from "react";
import {useForm} from "@tanstack/react-form";
import {toast} from "sonner";
import {Plus} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import ImageUploader from "@/components/ImageUploader";
import {Loader} from "lucide-react";
import {createFeaturedImageSchema} from "@/lib/schemas/featured.scheam";
import createFeaturedImage from "@/app/(admin)/admin/dashboard/featured/action/create-featured-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NewFeaturedImageDialog() {
    const [open, setOpen] = React.useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createFeaturedImage,
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 400:
                        toast.error("Invalid featured image data.", {
                            description: "Please check your form inputs.",
                        });
                        break;
                    case 401:
                        toast.error("You are not authorized to perform this action.");
                        break;
                    default:
                        toast.error(result.error || "Something went wrong.");
                }
                return;
            }
            queryClient.invalidateQueries({ queryKey: ['admin-featured-images'] });
            toast.success(result.message);
            form.reset();
            setOpen(false);
        },
        onError: () => {
            toast.error("An unexpected error occurred while creating the featured image.");
        },
    });

    const form = useForm({
        defaultValues: {
            image: "",
            title: "",
            subtitle: "",
            cta: "",
            ctaLink: "",
        },
        validators: {
            onSubmit: createFeaturedImageSchema,
        },
        onSubmit: async ({value}) => {
            mutation.mutate(value);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-1"/>
                    Featured Image
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Featured Image</DialogTitle>
                    <DialogDescription>
                        Add a featured image to display on the homepage.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="new-featured-image-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="image">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                                    <ImageUploader
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        folder="featured-images"
                                        maxSizeMB={5}
                                    />
                                    <FieldDescription>Upload an image (max 5MB)</FieldDescription>
                                    {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                </Field>
                            );
                        }}
                    </form.Field>

                    {/* Title */}
                    <form.Field name="title">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Promo banner"
                                        autoComplete="off"
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                </Field>
                            );
                        }}
                    </form.Field>

                    {/* Subtitle */}
                    <form.Field name="subtitle">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Subtitle</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Subheading (optional)"
                                        autoComplete="off"
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                </Field>
                            );
                        }}
                    </form.Field>

                    {/* CTA */}
                    <form.Field name="cta">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Call to Action (CTA) *</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Shop now"
                                        autoComplete="off"
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                </Field>
                            );
                        }}
                    </form.Field>

                    {/* CTA Link */}
                    <form.Field name="ctaLink">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>CTA Link *</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="https://example.com/shop"
                                        autoComplete="off"
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                </Field>
                            );
                        }}
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
                    <Button type="submit" form="new-featured-image-form" disabled={mutation.isPending}>
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Create Featured Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
