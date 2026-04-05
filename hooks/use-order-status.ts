import {useQuery} from "@tanstack/react-query";
import {getOrderStatus} from "@/app/(client)/actions/get-order-status";

export function useOrderStatus(orderId: number | null) {
    return useQuery({
        queryKey: ['order-status', orderId],
        queryFn: async () => {
            if (!orderId) return null;
            return await getOrderStatus(orderId);
        },
        enabled: !!orderId,
        staleTime: 1000 * 30, // Consider data fresh for 30 seconds
        refetchInterval: 1000 * 60, // Poll every minute for status updates
    });
}

