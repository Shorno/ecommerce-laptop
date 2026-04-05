import { z } from "zod"

export const addressSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 2 characters")
        .max(200, "Full name is too long"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number is too long")
        .regex(/^[\d\s\-+()]+$/, "Invalid phone number format"),
    email: z
        .email("Invalid email address")
        .max(255, "Email is too long"),
    addressLine: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(255, "Address is too long"),
    city: z
        .string()
        .min(2, "City name is required")
        .max(100, "City name is too long"),
    area: z
        .string()
        .min(2, "Area is required")
        .max(100, "Area name is too long"),
    postalCode: z
        .string()
        .min(4, "Postal code is required")
        .max(20, "Postal code is too long")
        .regex(/^\d{4}$/, "Postal code must be 4 digits"),
    country: z.string().default("BD").nonoptional(),
})

export type AddressFormValues = z.infer<typeof addressSchema>

export interface ShippingFormData extends AddressFormValues {
    paymentType: "online" | "cod"
}
