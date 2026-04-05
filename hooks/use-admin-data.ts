import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getOrders} from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";
import getProducts from "@/app/(admin)/admin/dashboard/products/actions/get-products";

// Hook for admin orders with automatic refetching
export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            return await getOrders();
        },
        staleTime: 1000 * 30, // Refresh every 30 seconds
        refetchInterval: 1000 * 60, // Poll every minute for new orders
    });
}

// Hook for admin products
export function useAdminProducts() {
    return useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            return await getProducts();
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
}

// Hook to invalidate related queries after mutations
export function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return {
        invalidateProducts: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
        invalidateOrders: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['order-status'] });
        },
        invalidateCategories: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories-with-subs'] });
        },
    };
}

