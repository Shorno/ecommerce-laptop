"use client"

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useCartActions, useCartItems } from "@/stote/cart-sotre";

/**
 * CartSync component handles syncing cart between local storage and database
 * - On login: syncs local cart to database, then loads merged cart from database
 * - On logout: clears local cart
 * - Runs only once per session
 */
export default function CartSync() {
    const session = authClient.useSession();
    const { syncToDatabase, loadFromDatabase, clearCart } = useCartActions();
    const cartItems = useCartItems();
    const hasSyncedRef = useRef(false);
    const previousAuthStateRef = useRef<boolean>(false);

    useEffect(() => {
        const isAuthenticated = !!session.data?.user;
        const wasAuthenticated = previousAuthStateRef.current;

        // User just logged in
        if (isAuthenticated && !wasAuthenticated && !hasSyncedRef.current) {
            console.log("User logged in, syncing cart...");

            const performSync = async () => {
                try {
                    if (cartItems.length > 0) {
                        // First, sync local cart to database (merges with existing)
                        console.log(`Syncing ${cartItems.length} local items to database...`);
                        await syncToDatabase();
                        console.log("Local cart synced to database");
                    }

                    // Then load from database to get the merged result
                    // This ensures we have all items from both sources
                    console.log("Loading merged cart from database...");
                    await loadFromDatabase();
                    console.log("Cart successfully loaded from database");
                } catch (error) {
                    console.error("Error during cart sync:", error);
                }
            };

            performSync();
            hasSyncedRef.current = true;
        }

        // User just logged out
        if (!isAuthenticated && wasAuthenticated) {
            console.log("User logged out, clearing local cart...");
            clearCart(false); // Clear local cart only (preserves database cart)
            hasSyncedRef.current = false;
        }

        // Update previous auth state
        previousAuthStateRef.current = isAuthenticated;
    }, [session.data?.user, syncToDatabase, loadFromDatabase, clearCart, cartItems.length]);

    return null; // This component doesn't render anything
}
