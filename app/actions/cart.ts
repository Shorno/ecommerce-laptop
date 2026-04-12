"use server"

import {db} from "@/db/config"
import {eq, and} from "drizzle-orm"
import {auth} from "@/lib/auth"
import {headers} from "next/headers"
import { cart, cartItem } from "@/db/schema/cart";
import {product} from "@/db/schema/product";

export interface CartItemData {
    productId: number
    quantity: number
    priceAtAdd: string
    variantId: number
}

// Get or create cart for user
async function getOrCreateCart(userId: string) {
    const existingCart = await db.query.cart.findFirst({
        where: eq(cart.userId, userId),
    })

    if (existingCart) {
        return existingCart;
    }

    const [newCart] = await db
        .insert(cart)
        .values({
            userId,
        })
        .returning()

    return newCart;
}

// Get cart items for a user
export async function getCartItems() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return { success: false, data: null, error: "Not authenticated" };
        }

        const userCart = await getOrCreateCart(session.user.id);

        const items = await db.query.cartItem.findMany({
            where: eq(cartItem.cartId, userCart.id),
            with: {
                product: true,
                variant: true,
            }
        });

        return { success: true, data: items, error: null };
    } catch (error) {
        console.error("Error getting cart items:", error);
        return { success: false, data: null, error: "Failed to get cart items" };
    }
}

// Add item to cart
export async function addToCart(productId: number, quantity: number = 1, variantId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const userCart = await getOrCreateCart(session.user.id);

        // Get product/variant price for storing
        const productData = await db.query.product.findFirst({
            where: eq(product.id, productId),
        });

        if (!productData) {
            return { success: false, error: "Product not found" };
        }

        // Check if item already exists in cart (same product + same variant)
        const existingItem = await db.query.cartItem.findFirst({
            where: and(
                eq(cartItem.cartId, userCart.id),
                eq(cartItem.productId, productId),
                eq(cartItem.variantId, variantId)
            )
        });

        if (existingItem) {
            // Update quantity
            await db
                .update(cartItem)
                .set({
                    quantity: existingItem.quantity + quantity,
                })
                .where(eq(cartItem.id, existingItem.id));
        } else {
            // Get the variant price
            const {productVariant} = await import("@/db/schema/product")
            const variant = await db.query.productVariant.findFirst({
                where: eq(productVariant.id, variantId),
            })

            await db.insert(cartItem).values({
                cartId: userCart.id,
                productId,
                variantId,
                quantity,
                priceAtAdd: variant?.price || "0",
            });
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: "Failed to add to cart" };
    }
}

// Update cart item quantity
export async function updateCartItemQuantity(productId: number, quantity: number, variantId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const userCart = await getOrCreateCart(session.user.id);

        const existingItem = await db.query.cartItem.findFirst({
            where: and(
                eq(cartItem.cartId, userCart.id),
                eq(cartItem.productId, productId),
                eq(cartItem.variantId, variantId)
            )
        });

        if (!existingItem) {
            return { success: false, error: "Item not found in cart" };
        }

        if (quantity <= 0) {
            await db.delete(cartItem).where(eq(cartItem.id, existingItem.id));
        } else {
            await db
                .update(cartItem)
                .set({ quantity })
                .where(eq(cartItem.id, existingItem.id));
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating cart item:", error);
        return { success: false, error: "Failed to update cart item" };
    }
}

// Remove item from cart
export async function removeFromCart(productId: number, variantId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const userCart = await getOrCreateCart(session.user.id);

        await db.delete(cartItem).where(
            and(
                eq(cartItem.cartId, userCart.id),
                eq(cartItem.productId, productId),
                eq(cartItem.variantId, variantId)
            )
        );

        return { success: true, error: null };
    } catch (error) {
        console.error("Error removing from cart:", error);
        return { success: false, error: "Failed to remove from cart" };
    }
}

// Clear entire cart
export async function clearCart() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const userCart = await getOrCreateCart(session.user.id);
        await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

        return { success: true, error: null };
    } catch (error) {
        console.error("Error clearing cart:", error);
        return { success: false, error: "Failed to clear cart" };
    }
}

// Sync local cart to database
export async function syncCartToDatabase(items: CartItemData[]) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const userCart = await getOrCreateCart(session.user.id);

        // Clear existing cart items
        await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

        // Insert new items
        if (items.length > 0) {
            await db.insert(cartItem).values(
                items.map(item => ({
                    cartId: userCart.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    priceAtAdd: item.priceAtAdd,
                }))
            );
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error syncing cart:", error);
        return { success: false, error: "Failed to sync cart" };
    }
}
