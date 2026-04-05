import {useQuery} from "@tanstack/react-query";
import {getProducts} from "@/app/(client)/actions/get-products";

interface ProductsParams {
    category?: string;
    subcategory?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    search?: string;
}

export function useProducts(params: ProductsParams) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            return await getProducts(params);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    });
}

// Hook for featured products on homepage
export function useFeaturedProducts() {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: async () => {
            return await getProducts({ sort: 'featured' });
        },
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes (featured products change less)
        gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    });
}

