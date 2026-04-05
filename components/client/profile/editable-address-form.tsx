"use client"

import * as React from "react"
import {useForm} from "@tanstack/react-form"
import {Card, CardContent} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {addressSchema} from "@/lib/schemas/address.scheam"
import {CITIES_WITH_AREAS} from "@/lib/data/city"
import {type CustomerAddress} from "@/db/schema/customer-adress"
import {updateCustomerInfo} from "@/app/(client)/(account)/actions/update-customer-info"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"
import {Loader2} from "lucide-react"
import {User} from "better-auth";

interface EditableAddressFormProps {
    customerInfo: CustomerAddress | null
    user: User | null
}

export default function EditableAddressForm({customerInfo, user}: EditableAddressFormProps) {
    const [selectedCity, setSelectedCity] = React.useState<string>(customerInfo?.city || "")
    const [availableAreas, setAvailableAreas] = React.useState<readonly string[]>(
        customerInfo?.city ? CITIES_WITH_AREAS[customerInfo.city as keyof typeof CITIES_WITH_AREAS] || [] : []
    )
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateCustomerInfo,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message)
                queryClient.invalidateQueries({queryKey: ['customerInfo']})
            } else {
                toast.error(data.message)
            }
        },
        onError: () => {
            toast.error("Failed to update address")
        }
    })

    const form = useForm({
        defaultValues: {
            fullName: customerInfo?.fullName || "",
            phone: customerInfo?.phone || "",
            email: user?.email || "",
            city: customerInfo?.city || "",
            area: customerInfo?.area || "",
            postalCode: customerInfo?.postalCode || "",
            addressLine: customerInfo?.addressLine || "",
            country: customerInfo?.country || "BD",
        },
        validators: {
            onChange: addressSchema,
        },
        onSubmit: async ({value}) => {
            mutation.mutate(value)
        },
    })

    const handleCityChange = (city: string) => {
        setSelectedCity(city)
        setAvailableAreas(CITIES_WITH_AREAS[city as keyof typeof CITIES_WITH_AREAS] || [])
        form.setFieldValue("city", city)
        form.setFieldValue("area", "")
    }

    return (
        <Card className="rounded-sm">
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <FieldGroup>
                        {/* Full Name & Phone Number - Two Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field name="fullName">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Full name *
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Enter full name"
                                                autoComplete="name"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>

                            <form.Field name="phone">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Phone number *
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="tel"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Enter phone number"
                                                autoComplete="tel"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>

                        {/* City & Area - Two Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field name="city">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                City *
                                            </FieldLabel>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(value) => {
                                                    handleCityChange(value)
                                                    field.handleBlur()
                                                }}
                                            >
                                                <SelectTrigger id={field.name}>
                                                    <SelectValue placeholder="Select city"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(CITIES_WITH_AREAS).map((city) => (
                                                        <SelectItem key={city} value={city}>
                                                            {city}
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

                            <form.Field name="area">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Area *
                                            </FieldLabel>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(value) => {
                                                    field.handleChange(value)
                                                    field.handleBlur()
                                                }}
                                                disabled={!selectedCity}
                                            >
                                                <SelectTrigger id={field.name}>
                                                    <SelectValue
                                                        placeholder={
                                                            selectedCity
                                                                ? "Select area"
                                                                : "Select city first"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableAreas.map((area) => (
                                                        <SelectItem key={area} value={area}>
                                                            {area}
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

                        {/* Address Line - Full Width */}
                        <form.Field name="addressLine">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Address *
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="House no., street name"
                                            autoComplete="street-address"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Postal Code - Half Width */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field name="postalCode">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Postal code *
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Enter postal code"
                                                autoComplete="postal-code"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>
                    </FieldGroup>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="min-w-[120px]"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Updating...
                                </>
                            ) : (
                                "Update Info"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
