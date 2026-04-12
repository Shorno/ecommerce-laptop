import {create} from "zustand";
import {persist, createJSONStorage,} from "zustand/middleware";
import {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart as clearDbCart,
    syncCartToDatabase,
    getCartItems
} from "@/app/actions/cart";

export interface CartItem {
    id: number           // productId
    variantId: number
    variantLabel: string
    name: string
    image: string
    price: string       // variant price
    quantity: number
    subtotal: number
    maxStock: number
}

interface CartState {
    items: CartItem[]
    totalQuantity: number;
    totalPrice: number;
    isOpen?: boolean;
    isSyncing: boolean;
    actions: {
        addItem: (product: any, isAuthenticated?: boolean) => Promise<void>;
        setIsOpen?: (isOpen: boolean) => void;
        increment: (productId: number, variantId: number, isAuthenticated?: boolean) => Promise<void>;
        decrement: (productId: number, variantId: number, isAuthenticated?: boolean) => Promise<void>;
        removeItem: (productId: number, variantId: number, isAuthenticated?: boolean) => Promise<void>;
        clearCart: (isAuthenticated?: boolean) => Promise<void>;
        syncToDatabase: () => Promise<void>;
        loadFromDatabase: () => Promise<void>;
        buyNow: (product: any, quantity: number, isAuthenticated?: boolean) => Promise<void>;
    };
}

function calculateTotals(items: CartItem[]) {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0)
    return {totalQuantity, totalPrice}
}

function calculateSubtotal(price: number, quantity: number): number {
    return Number(price) * quantity;
}

// Unique key for cart item = productId + variantId
function getItemKey(productId: number, variantId: number): string {
    return `${productId}-${variantId}`
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalQuantity: 0,
            totalPrice: 0,
            isOpen: false,
            isSyncing: false,
            actions: {
                async addItem(product: any, isAuthenticated = false) {
                    set((state) => {
                        const key = getItemKey(product.id, product.variantId)
                        const existingIndex = state.items.findIndex(
                            i => getItemKey(i.id, i.variantId) === key
                        )

                        let updatedItems: CartItem[]

                        if (existingIndex !== -1) {
                            updatedItems = state.items.map((item, idx) => {
                                if (idx !== existingIndex) return item
                                const max = item.maxStock ?? Infinity
                                const nextQty = Math.min(item.quantity + 1, max)
                                return {
                                    ...item,
                                    quantity: nextQty,
                                    subtotal: calculateSubtotal(Number(item.price), nextQty)
                                }
                            })
                        } else {
                            const newItem: CartItem = {
                                id: product.id,
                                variantId: product.variantId,
                                variantLabel: product.variantLabel || "Default",
                                name: product.name,
                                image: product.image,
                                price: product.price,
                                quantity: 1,
                                subtotal: calculateSubtotal(Number(product.price), 1),
                                maxStock: product.maxStock ?? 999,
                            }
                            updatedItems = [...state.items, newItem]
                        }

                        const {totalQuantity, totalPrice} = calculateTotals(updatedItems)
                        return {items: updatedItems, totalPrice, totalQuantity, isOpen: true}
                    });

                    if (isAuthenticated) {
                        await addToCart(product.id, 1, product.variantId);
                    }
                },

                async increment(productId, variantId, isAuthenticated = false) {
                    let newQuantity = 0;

                    set((state) => {
                        const items = state.items.map((item) => {
                            if (item.id === productId && item.variantId === variantId) {
                                const max = item.maxStock ?? Infinity;
                                newQuantity = Math.min(item.quantity + 1, max);
                                return {
                                    ...item,
                                    quantity: newQuantity,
                                    subtotal: calculateSubtotal(Number(item.price), newQuantity)
                                }
                            }
                            return item;
                        })
                        const {totalQuantity, totalPrice} = calculateTotals(items);
                        return {items, totalQuantity, totalPrice}
                    });

                    if (isAuthenticated && newQuantity > 0) {
                        await updateCartItemQuantity(productId, newQuantity, variantId);
                    }
                },

                async decrement(productId, variantId, isAuthenticated = false) {
                    let newQuantity = 0;

                    set((state) => {
                        const items = state.items.map((item) => {
                            if (item.id === productId && item.variantId === variantId) {
                                newQuantity = Math.max(item.quantity - 1, 1);
                                return {
                                    ...item,
                                    quantity: newQuantity,
                                    subtotal: calculateSubtotal(Number(item.price), newQuantity)
                                }
                            }
                            return item;
                        })
                        const {totalQuantity, totalPrice} = calculateTotals(items);
                        return {items, totalQuantity, totalPrice}
                    });

                    if (isAuthenticated && newQuantity > 0) {
                        await updateCartItemQuantity(productId, newQuantity, variantId);
                    }
                },

                async removeItem(productId, variantId, isAuthenticated = false) {
                    set((state) => {
                        const items = state.items.filter(
                            i => !(i.id === productId && i.variantId === variantId)
                        )
                        const {totalQuantity, totalPrice} = calculateTotals(items);
                        return {items, totalQuantity, totalPrice};
                    });

                    if (isAuthenticated) {
                        await removeFromCart(productId, variantId);
                    }
                },

                setIsOpen(isOpen: boolean) {
                    set(() => ({isOpen}));
                },

                async clearCart(isAuthenticated = false) {
                    set(() => ({items: [], totalQuantity: 0, totalPrice: 0, isOpen: false}));
                    if (isAuthenticated) {
                        await clearDbCart();
                    }
                },

                async syncToDatabase() {
                    const state = get();
                    if (state.isSyncing || state.items.length === 0) return;

                    set({isSyncing: true});

                    try {
                        const cartData = state.items.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            priceAtAdd: item.price,
                            variantId: item.variantId,
                        }));

                        await syncCartToDatabase(cartData);
                    } catch (error) {
                        console.error("Error syncing cart to database:", error);
                    } finally {
                        set({isSyncing: false});
                    }
                },

                async loadFromDatabase() {
                    const state = get();
                    if (state.isSyncing) return;

                    set({isSyncing: true});

                    try {
                        const result = await getCartItems();

                        if (result.success && result.data) {
                            const cartItems: CartItem[] = result.data.map((item: any) => ({
                                id: item.product.id,
                                variantId: item.variantId,
                                variantLabel: item.variant?.optionValues
                                    ? Object.values(JSON.parse(item.variant.optionValues)).join(" / ")
                                    : "Default",
                                name: item.product.name,
                                image: item.product.image,
                                price: item.variant?.price || item.priceAtAdd,
                                quantity: item.quantity,
                                subtotal: calculateSubtotal(
                                    Number(item.variant?.price || item.priceAtAdd),
                                    item.quantity
                                ),
                                maxStock: item.variant?.stock ?? 999,
                            }));

                            const {totalQuantity, totalPrice} = calculateTotals(cartItems);
                            set({items: cartItems, totalQuantity, totalPrice});
                        }
                    } catch (error) {
                        console.error("Error loading cart from database:", error);
                    } finally {
                        set({isSyncing: false});
                    }
                },

                async buyNow(product: any, quantity: number, isAuthenticated = false) {
                    set(() => ({items: [], totalQuantity: 0, totalPrice: 0, isOpen: false}));

                    const newItem: CartItem = {
                        id: product.id,
                        variantId: product.variantId,
                        variantLabel: product.variantLabel || "Default",
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        quantity,
                        subtotal: calculateSubtotal(Number(product.price), quantity),
                        maxStock: product.maxStock ?? 999,
                    };

                    set({
                        items: [newItem],
                        totalQuantity: quantity,
                        totalPrice: newItem.subtotal,
                        isOpen: true,
                    });

                    if (isAuthenticated) {
                        await clearDbCart();
                        await addToCart(product.id, quantity, product.variantId);
                    }
                },
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
                totalQuantity: state.totalQuantity,
                totalPrice: state.totalPrice,
                isOpen: state.isOpen
            }),
            version: 2, // Bump version to force rehydration with new CartItem shape
            onRehydrateStorage: () => {
                return (state) => {
                    if (state?.items) {
                        const {totalQuantity, totalPrice} = calculateTotals(state.items);
                        state.totalQuantity = totalQuantity;
                        state.totalPrice = totalPrice;
                    }
                }
            }
        }
    )
)

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotalQuantity = () => useCartStore((state) => state.totalQuantity);
export const useCartTotalPrice = () => useCartStore((state) => state.totalPrice);
export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
