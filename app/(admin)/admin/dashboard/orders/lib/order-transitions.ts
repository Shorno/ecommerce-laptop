import type { OrderStatus } from "@/db/schema"

/**
 * Strict sequential COD pipeline transitions.
 * Each status maps to the ONE valid next step(s).
 */
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped"],
    shipped: ["delivered"],
    delivered: [],     // terminal
    cancelled: [],     // terminal
    refunded: [],      // terminal
}

export function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
    return VALID_TRANSITIONS[currentStatus] ?? []
}

export function getNextActionLabel(currentStatus: OrderStatus): string | null {
    const labels: Partial<Record<OrderStatus, string>> = {
        pending: "Confirm Order",
        confirmed: "Start Processing",
        processing: "Mark as Shipped",
        shipped: "Mark as Delivered",
    }
    return labels[currentStatus] ?? null
}
