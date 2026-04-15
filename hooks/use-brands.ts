import {useQuery} from "@tanstack/react-query";
import {getBrandsForSelect} from "@/app/(admin)/admin/dashboard/products/actions/get-brands-for-select";

export function useBrands() {
    return useQuery({
        queryKey: ['brands-for-select'],
        queryFn: async () => {
            return await getBrandsForSelect();
        },
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
    });
}
