"use client"

import * as React from "react"
import {useForm} from "@tanstack/react-form"
import {toast} from "sonner"

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
import {createProductSchema} from "@/lib/schemas/product.schema"
import {Switch} from "@/components/ui/switch"
import ImageUploader from "@/components/ImageUploader"
import AdditionalImagesUploader from "@/components/AdditionalImagesUploader"
import {generateSlug} from "@/utils/generate-slug"
import {useState} from "react"
import createProduct from "@/app/(admin)/admin/dashboard/products/actions/create-product"
import {Loader} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useCategories, useSubCategories} from "@/hooks/use-categories"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function NewProductDialog() {
    const [open, setOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const queryClient = useQueryClient()

    const {data: categories = []} = useCategories()
    const subCategories = useSubCategories(selectedCategory)

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (result) => {
            if (!result.success) {
                switch (result.status) {
                    case 400:
                        toast.error("Invalid product data.", {
                            description: "Please check your form inputs.",
                        })
                        break
                    case 401:
                        toast.error("You are not authorized to perform this action.")
                        break
                    default:
                        toast.error(result.error || "Something went wrong.")
                }
                return
            }
            queryClient.invalidateQueries({ queryKey: ['admin-products'] })
            toast.success(result.message)
            form.reset()
            setSelectedCategory(null)
            setOpen(false)
        },
        onError: () => {
            toast.error("An unexpected error occurred while creating the product.")
        },
    })

    const form = useForm({
        defaultValues: {
            name: "",
            slug: "",
            categoryId: 0,
            subCategoryId: undefined as number | undefined,
            size: "",
            price: "",
            stockQuantity: 0,
            image: "",
            additionalImages: [] as string[],
            inStock: true,
            isFeatured: false,
        },
        validators: {
            //@ts-ignore
            onSubmit: createProductSchema,
        },
        onSubmit: async ({value}) => {
            mutation.mutate(value)
        },
    })

    const autoGenerateSlugFromName = (value: string) => {
        const generatedSlug = generateSlug(value)
        form.setFieldValue("slug", generatedSlug)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>New Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your store inventory.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="new-product-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    {/* Image Uploader */}
                    <form.Field name="image">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Product Image *</FieldLabel>
                                    <ImageUploader
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        folder="products"
                                        maxSizeMB={5}
                                    />
                                    <FieldDescription>
                                        Upload a product image (max 5MB)
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Product Name */}
                    <form.Field name="name">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Product Name *
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value)
                                            autoGenerateSlugFromName(e.target.value)
                                        }}
                                        aria-invalid={isInvalid}
                                        placeholder="Organic Tomatoes"
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Slug */}
                    <form.Field name="slug">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
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
                                        placeholder="organic-tomatoes"
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        URL-friendly version of the name.
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>


                    {/* Category and Subcategory Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <form.Field name="categoryId">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Category *</FieldLabel>
                                        <Select
                                            value={field.state.value?.toString()}
                                            onValueChange={(value) => {
                                                const numValue = parseInt(value)
                                                field.handleChange(numValue)
                                                setSelectedCategory(numValue)
                                                form.setFieldValue("subCategoryId", undefined)
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Subcategory */}
                        <form.Field name="subCategoryId">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Subcategory (Optional)
                                        </FieldLabel>
                                        <Select
                                            value={field.state.value?.toString() || "none"}
                                            onValueChange={(value) => {
                                                field.handleChange(value === "none" ? undefined : parseInt(value))
                                            }}
                                            disabled={!selectedCategory || subCategories.length === 0}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select subcategory"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {subCategories.map((subCat) => (
                                                    <SelectItem key={subCat.id} value={subCat.id.toString()}>
                                                        {subCat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>
                    </div>

                    {/* Size and Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Size */}
                        <form.Field name="size">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Size *</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="500g, 1kg, 250ml"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Price */}
                        <form.Field name="price">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Price *</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="9.99"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>
                    </div>

                    {/* Stock Quantity */}
                    <form.Field name="stockQuantity">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Stock Quantity</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                                        aria-invalid={isInvalid}
                                        placeholder="100"
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* Additional Images Uploader */}
                    <form.Field name="additionalImages">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Additional Images (Optional)
                                    </FieldLabel>
                                    <AdditionalImagesUploader
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        folder="products/additional"
                                        maxSizeMB={5}
                                    />
                                    <FieldDescription>
                                        Upload additional images for the product (max 5MB each)
                                    </FieldDescription>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    {/* In Stock Switch */}
                    <form.Field name="inStock">
                        {(field) => (
                            <Field>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FieldLabel htmlFor={field.name}>In Stock</FieldLabel>
                                        <FieldDescription>
                                            Mark product as available for purchase
                                        </FieldDescription>
                                    </div>
                                    <Switch
                                        id={field.name}
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </div>
                            </Field>
                        )}
                    </form.Field>

                    {/* Is Featured Switch */}
                    <form.Field name="isFeatured">
                        {(field) => (
                            <Field>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FieldLabel htmlFor={field.name}>Featured Product</FieldLabel>
                                        <FieldDescription>
                                            Display this product in featured sections
                                        </FieldDescription>
                                    </div>
                                    <Switch
                                        id={field.name}
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </div>
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
                    <Button
                        type="submit"
                        form="new-product-form"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Create Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
