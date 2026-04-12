"use client"

import * as React from "react";
import {useForm} from "@tanstack/react-form";
import {toast} from "sonner";
import {Plus, Loader} from "lucide-react";

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
import {createBrandSchema} from "@/lib/schemas/brand.schema";
import createBrand from "@/app/(admin)/admin/dashboard/brands/action/create-brand";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function NewBrandDialog() {
    const [open, setOpen] = React.useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createBrand,
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 400:
                        toast.error("Invalid brand data.", {
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
            queryClient.invalidateQueries({queryKey: ['admin-brands']});
            toast.success(result.message);
            form.reset();
            setOpen(false);
        },
        onError: () => {
            toast.error("An unexpected error occurred while creating the brand.");
        },
    });

    const form = useForm({
        defaultValues: {
            name: "",
            slug: "",
            logo: "",
            isActive: true,
            displayOrder: 0,
        },
        validators: {
            onSubmit: createBrandSchema,
        },
        onSubmit: async ({value}) => {
            mutation.mutate(value);
        },
    });

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        form.setFieldValue("name", name);
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
        form.setFieldValue("slug", slug);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-1"/>
                    Add Brand
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Brand</DialogTitle>
                    <DialogDescription>
                        Add a brand to display on the homepage brand showcase.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="new-brand-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column — Logo */}
                        <div>
                            <form.Field name="logo">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
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
                                    );
                                }}
                            </form.Field>
                        </div>

                        {/* Right Column — Details */}
                        <div className="space-y-4">
                            <form.Field name="name">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="e.g. Lenovo"
                                                autoComplete="off"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <form.Field name="slug">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
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
                                                placeholder="auto-generated-from-name"
                                                autoComplete="off"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="displayOrder">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
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
                                        );
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
                    <Button type="submit" form="new-brand-form" disabled={mutation.isPending}>
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Create Brand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
