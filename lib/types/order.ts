// Order-related types for the application
import { ShippingFormData } from "@/lib/schemas/address.scheam"
import { CartItem } from "@/stote/cart-sotre"

export interface OrderItem {
    id: number
    productName: string
    productSize: string
    productImage: string
    quantity: number
    unitPrice: string
    subtotal: string
}

export interface OrderData {
    id: number
    orderNumber: string
    status: string
    subtotal: string
    shippingAmount: string
    totalAmount: string
    customerFullName: string
    customerEmail: string
    customerPhone: string
    shippingAddressLine: string
    shippingCity: string
    shippingArea: string | null
    shippingPostalCode: string
    shippingCountry: string
    createdAt: Date
    items: OrderItem[]
}

export const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200",
} as const

export type OrderStatus = keyof typeof statusColors

export interface CreateOrderData {
    shipping: ShippingFormData
    items: CartItem[]
}

export interface OrderResponse {
    success: boolean
    orderId?: number
    orderNumber?: string
    error?: string
}
