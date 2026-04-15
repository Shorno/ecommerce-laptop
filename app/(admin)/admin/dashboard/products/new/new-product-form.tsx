"use client"

import * as React from "react"
import {useState, useCallback} from "react"
import {useRouter} from "next/navigation"
import {useForm} from "@tanstack/react-form"
import {toast} from "sonner"
import {ArrowLeft, Loader, Star} from "lucide-react"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {createProductSchema} from "@/lib/schemas/product.schema"
import {Switch} from "@/components/ui/switch"
import ImageUploader from "@/components/ImageUploader"
import AdditionalImagesUploader from "@/components/AdditionalImagesUploader"
import {generateSlug} from "@/utils/generate-slug"
import createProduct from "@/app/(admin)/admin/dashboard/products/actions/create-product"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useCategories, useSubCategories} from "@/hooks/use-categories"
import {useBrands} from "@/hooks/use-brands"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {Separator} from "@/components/ui/separator"
import {Label} from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import SpecificationBuilder, {SpecGroup} from "@/components/ui/specification-builder"
import KeyFeaturesBuilder, {KeyFeature} from "@/components/ui/key-features-builder"
import ProductOptionBuilder, {ProductOptionData} from "@/components/ui/product-option-builder"
import VariantTableBuilder, {VariantData} from "@/components/ui/variant-table-builder"

export default function NewProductForm() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const queryClient = useQueryClient()

    // Local state for options (managed outside TanStack Form for reactivity)
    const [options, setOptions] = useState<ProductOptionData[]>([])
    const [variants, setVariants] = useState<VariantData[]>([{
        sku: "",
        price: "",
        stock: 0,
        inStock: true,
        optionValues: {},
    }])

    const {data: categories = []} = useCategories()
    const {data: brands = []} = useBrands()
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
            queryClient.invalidateQueries({queryKey: ['admin-products']})
            toast.success(result.message)
            router.push("/admin/dashboard/products")
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
            brandId: undefined as number | undefined,
            image: "",
            additionalImages: [] as string[],
            isFeatured: false,
            keyFeatures: "",
            description: "",
            specifications: "",
        },
        onSubmit: async ({value}) => {
            // Merge options + variants into the form data
            const formData = {
                ...value,
                options: options.filter(o => o.name && o.values.length > 0).map((o, i) => ({
                    name: o.name,
                    values: o.values,
                    position: i,
                })),
                variants: variants.map(v => ({
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    inStock: v.inStock,
                    optionValues: v.optionValues,
                })),
            }

            // Validate with Zod
            const result = createProductSchema.safeParse(formData)
            if (!result.success) {
                const errors = result.error.flatten()
                const fieldMessages: string[] = []

                // Collect field-level errors
                for (const [field, msgs] of Object.entries(errors.fieldErrors)) {
                    if (msgs && msgs.length > 0) {
                        fieldMessages.push(`${field}: ${(msgs as string[]).join(", ")}`)
                    }
                }

                // Collect form-level errors
                if (errors.formErrors.length > 0) {
                    fieldMessages.push(...errors.formErrors)
                }

                const description = fieldMessages.length > 0
                    ? fieldMessages.join("\n")
                    : "Unknown validation error"

                toast.error("Validation failed", {
                    description,
                    duration: 8000,
                })
                console.error("Validation errors:", JSON.stringify(errors, null, 2))
                return
            }

            mutation.mutate(result.data)
        },
    })

    const autoGenerateSlugFromName = useCallback((value: string) => {
        const generatedSlug = generateSlug(value)
        form.setFieldValue("slug", generatedSlug)
    }, [form])

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <header
                className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                            <Link href="/admin/dashboard/products">
                                <ArrowLeft className="h-4 w-4"/>
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-sm sm:text-lg font-semibold truncate max-w-[200px] sm:max-w-none">
                                Create New Product
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/admin/dashboard/products")}
                            disabled={mutation.isPending}
                            className="hidden sm:inline-flex"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="product-form"
                            size="sm"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                            Create Product
                        </Button>
                    </div>
                </div>
            </header>

            <form
                id="product-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <div className="flex flex-col lg:flex-row">
                    {/* ── Main Content Area ── */}
                    <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-6 order-2 lg:order-1">
                        {/* Product Name */}
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
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
                                            placeholder="Enter product name..."
                                            autoComplete="off"
                                            className="text-2xl font-semibold h-auto py-3 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary px-2"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Slug / Permalink */}
                        <form.Field name="slug">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>Permalink:</span>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="auto-generated-slug"
                                                    autoComplete="off"
                                                    className="flex-1 h-8 text-sm"
                                                />
                                            </div>
                                            {field.state.value && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">Preview:</span>
                                                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                                        /product/{field.state.value}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                        {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* ── Options Card ── */}
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Product Options</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Define attributes like RAM/Storage, Color etc. Variants will be auto-generated from combinations.
                                </p>
                            </div>
                            <div className="p-4">
                                <ProductOptionBuilder
                                    value={options}
                                    onChange={setOptions}
                                />
                            </div>
                        </div>

                        {/* ── Variants Card ── */}
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Variants & Pricing</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Set price, stock, and SKU for each variant. At least one variant is required.
                                </p>
                            </div>
                            <div className="p-4">
                                <VariantTableBuilder
                                    value={variants}
                                    onChange={setVariants}
                                    options={options}
                                />
                            </div>
                        </div>

                        {/* ── Additional Images Card ── */}
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Gallery</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Upload additional product images (max 6)</p>
                            </div>
                            <div className="p-4">
                                <form.Field name="additionalImages">
                                    {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <AdditionalImagesUploader
                                                    value={field.state.value}
                                                    onChange={field.handleChange}
                                                    folder="products/additional"
                                                    maxSizeMB={5}
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>
                        </div>

                        {/* ── Key Features Card ── */}
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Key Features</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Quick specs shown on the product page</p>
                            </div>
                            <div className="p-4">
                                <form.Field name="keyFeatures">
                                    {(field) => {
                                        const featuresData: KeyFeature[] = field.state.value
                                            ? (() => { try { return JSON.parse(field.state.value) } catch { return [] } })()
                                            : []
                                        return (
                                            <Field>
                                                <KeyFeaturesBuilder
                                                    value={featuresData}
                                                    onChange={(features) => field.handleChange(JSON.stringify(features))}
                                                />
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>
                        </div>

                        {/* ── Description Card ── */}
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Product Description</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Rich text description shown on the product page</p>
                            </div>
                            <div className="p-4">
                                <form.Field name="description">
                                    {(field) => (
                                        <Field>
                                            <RichTextEditor
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                placeholder="Write a detailed product description..."
                                            />
                                        </Field>
                                    )}
                                </form.Field>
                            </div>
                        </div>

                        {/* ── Specifications Card ── */}
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-semibold">Specifications</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Grouped technical specifications</p>
                            </div>
                            <div className="p-4">
                                <form.Field name="specifications">
                                    {(field) => {
                                        const specData: SpecGroup[] = field.state.value
                                            ? (() => { try { return JSON.parse(field.state.value) } catch { return [] } })()
                                            : []
                                        return (
                                            <Field>
                                                <SpecificationBuilder
                                                    value={specData}
                                                    onChange={(groups) => field.handleChange(JSON.stringify(groups))}
                                                />
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>
                        </div>
                    </main>

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-l bg-muted/30 p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 order-1 lg:order-2">
                        {/* Featured Image */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Featured Image *</Label>
                            <form.Field name="image">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <ImageUploader
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                folder="products"
                                                maxSizeMB={5}
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        <Separator/>

                        {/* Organization */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Organization</Label>

                            <form.Field name="categoryId">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <Label className="text-xs text-muted-foreground">Category *</Label>
                                            <Select
                                                value={field.state.value ? field.state.value.toString() : undefined}
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
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>

                            <form.Field name="subCategoryId">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <Label className="text-xs text-muted-foreground">Subcategory</Label>
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
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        <Separator/>

                        {/* Brand */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Brand</Label>
                            <form.Field name="brandId">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <Label className="text-xs text-muted-foreground">Select Brand</Label>
                                            <Select
                                                value={field.state.value?.toString() || "none"}
                                                onValueChange={(value) => {
                                                    field.handleChange(value === "none" ? undefined : parseInt(value))
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select brand"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {brands.map((b) => (
                                                        <SelectItem key={b.id} value={b.id.toString()}>
                                                            {b.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        <Separator/>

                        {/* Settings */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Settings</Label>

                            <form.Field name="isFeatured">
                                {(field) => (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Star
                                                className={`h-4 w-4 ${field.state.value ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}/>
                                            <Label htmlFor={field.name} className="text-sm cursor-pointer">
                                                Featured
                                            </Label>
                                        </div>
                                        <Switch
                                            id={field.name}
                                            checked={field.state.value}
                                            onCheckedChange={field.handleChange}
                                        />
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </aside>
                </div>
            </form>
        </div>
    )
}
