"use server"

import { db } from "@/db/config";
import { cart, cartItem } from "@/db/schema/cart";
import { product } from "@/db/schema/product";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface CartItemData {
    productId: number;
    quantity: number;
    priceAtAdd: string;
}

// Get or create cart for user
async function getOrCreateCart(userId: string) {
    const existingCart = await db.query.cart.findFirst({
        where: eq(cart.userId, userId),
    });

    if (existingCart) {
        return existingCart;
    }

    const [newCart] = await db
        .insert(cart)
        .values({
            userId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })
        .returning();

    return newCart;
}

// Get cart items for a user
export async function getCartItems() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, data: null, error: "Not authenticated" };
        }

        const cart = await getOrCreateCart(session.user.id);

        const items = await db.query.cartItem.findMany({
            where: eq(cartItem.cartId, cart.id),
            with: {
                product: true,
            },
        });

        return { success: true, data: items, error: null };
    } catch (error) {
        console.error("Error getting cart items:", error);
        return { success: false, data: null, error: "Failed to get cart items" };
    }
}

// Add item to cart
export async function addToCart(productId: number, quantity: number = 1) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const cart = await getOrCreateCart(session.user.id);

        // Get product to get current price
        const productData = await db.query.product.findFirst({
            where: eq(product.id, productId),
        });

        if (!productData) {
            return { success: false, error: "Product not found" };
        }

        // Check if item already exists in cart
        const existingItem = await db.query.cartItem.findFirst({
            where: and(
                eq(cartItem.cartId, cart.id),
                eq(cartItem.productId, productId)
            ),
        });

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            const maxQuantity = productData.stockQuantity ?? Infinity;
            const finalQuantity = Math.min(newQuantity, maxQuantity);

            await db
                .update(cartItem)
                .set({
                    quantity: finalQuantity,
                    updatedAt: new Date()
                })
                .where(eq(cartItem.id, existingItem.id));
        } else {
            // Insert new item
            await db.insert(cartItem).values({
                cartId: cart.id,
                productId,
                quantity,
                priceAtAdd: productData.price,
            });
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: "Failed to add to cart" };
    }
}

// Update cart item quantity
export async function updateCartItemQuantity(productId: number, quantity: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const cart = await getOrCreateCart(session.user.id);

        const existingItem = await db.query.cartItem.findFirst({
            where: and(
                eq(cartItem.cartId, cart.id),
                eq(cartItem.productId, productId)
            ),
        });

        if (!existingItem) {
            return { success: false, error: "Item not found in cart" };
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            await db.delete(cartItem).where(eq(cartItem.id, existingItem.id));
        } else {
            await db
                .update(cartItem)
                .set({
                    quantity,
                    updatedAt: new Date()
                })
                .where(eq(cartItem.id, existingItem.id));
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating cart item:", error);
        return { success: false, error: "Failed to update cart item" };
    }
}

// Remove item from cart
export async function removeFromCart(productId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const cart = await getOrCreateCart(session.user.id);

        await db.delete(cartItem).where(
            and(
                eq(cartItem.cartId, cart.id),
                eq(cartItem.productId, productId)
            )
        );

        return { success: true, error: null };
    } catch (error) {
        console.error("Error removing from cart:", error);
        return { success: false, error: "Failed to remove from cart" };
    }
}

// Sync local cart to database
export async function syncCartToDatabase(items: CartItemData[]) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const cart = await getOrCreateCart(session.user.id);

        // Get existing cart items
        const existingItems = await db.query.cartItem.findMany({
            where: eq(cartItem.cartId, cart.id),
        });

        // Create a map of existing items for quick lookup
        const existingItemsMap = new Map(
            existingItems.map((item) => [item.productId, item])
        );

        // Process each item from local cart
        for (const item of items) {
            const existingItem = existingItemsMap.get(item.productId);

            if (existingItem) {
                // Update existing item (use the higher quantity)
                const maxQuantity = Math.max(existingItem.quantity, item.quantity);
                await db
                    .update(cartItem)
                    .set({
                        quantity: maxQuantity,
                        updatedAt: new Date()
                    })
                    .where(eq(cartItem.id, existingItem.id));

                // Remove from map so we know it was processed
                existingItemsMap.delete(item.productId);
            } else {
                // Insert new item
                await db.insert(cartItem).values({
                    cartId: cart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtAdd: item.priceAtAdd,
                });
            }
        }

        // Note: We don't delete items that are in DB but not in local cart
        // This preserves items that might have been added from another device

        return { success: true, error: null };
    } catch (error) {
        console.error("Error syncing cart:", error);
        return { success: false, error: "Failed to sync cart" };
    }
}

// Clear cart
export async function clearCart() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const cart = await getOrCreateCart(session.user.id);

        await db.delete(cartItem).where(eq(cartItem.cartId, cart.id));

        return { success: true, error: null };
    } catch (error) {
        console.error("Error clearing cart:", error);
        return { success: false, error: "Failed to clear cart" };
    }
}
