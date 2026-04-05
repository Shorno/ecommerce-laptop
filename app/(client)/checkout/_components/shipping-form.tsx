"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { CreditCard, Banknote } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {addressSchema, ShippingFormData} from "@/lib/schemas/address.scheam"
import {authClient} from "@/lib/auth-client";
import {CITIES_WITH_AREAS} from "@/lib/data/city";


interface ShippingFormProps {
    onValidSubmit: (data: ShippingFormData) => void
}

export default function ShippingForm({ onValidSubmit }: ShippingFormProps) {
    const session = authClient.useSession()
    const [paymentType, setPaymentType] = React.useState<"online" | "cod">("online")
    const [selectedCity, setSelectedCity] = React.useState<string>("")
    const [availableAreas, setAvailableAreas] = React.useState<readonly string[]>([])
    const user = session?.data?.user

    const form = useForm({
        defaultValues: {
            fullName: user?.name || "",
            phone: "",
            email: user?.email || "",
            city: "",
            area: "",
            postalCode: "",
            addressLine: "",
            country: "BD",
        },
        validators: {
            onChange: addressSchema,
        },
        onSubmit: async ({ value }) => {
            onValidSubmit({
                ...value,
                paymentType
            })
        },
    })

    // Update available areas when city changes
    const handleCityChange = (city: string) => {
        setSelectedCity(city)
        setAvailableAreas(CITIES_WITH_AREAS[city as keyof typeof CITIES_WITH_AREAS] || [])
        form.setFieldValue("city", city)
        form.setFieldValue("area", "") // Reset area when city changes
    }

    return (
        <Card className="rounded-sm">
            <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Form Fields */}
                <form
                    id="shipping-form"
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
                                                <FieldError errors={field.state.meta.errors} />
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
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>
                        <form.Field name="email">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Email *
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Enter email address"
                                            autoComplete="email"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>


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
                                                    <SelectValue placeholder="Select city" />
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
                                                <FieldError errors={field.state.meta.errors} />
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
                                                <FieldError errors={field.state.meta.errors} />
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
                                            <FieldError errors={field.state.meta.errors} />
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
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>
                    </FieldGroup>
                </form>

                {/* Payment Method Selection - At the End */}
                <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
                    <RadioGroup
                        value={paymentType}
                        onValueChange={(value: "online" | "cod") => setPaymentType(value)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="online" id="online" className="peer sr-only" />
                            <Label
                                htmlFor="online"
                                className="flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent transition-all"
                            >
                                <CreditCard className="h-5 w-5" />
                                <div className="flex-1">
                                    <span className="font-medium block">Online Payment</span>
                                    <span className="text-xs text-muted-foreground">SSLCommerz</span>
                                </div>
                            </Label>
                        </div>

                        <div>
                            <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                            <Label
                                htmlFor="cod"
                                className="flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent transition-all"
                            >
                                <Banknote className="h-5 w-5" />
                                <div className="flex-1">
                                    <span className="font-medium block">Cash on Delivery</span>
                                    <span className="text-xs text-muted-foreground">Pay on arrival</span>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>
    )
}
