import { useQuery } from '@tanstack/react-query';
import { getSummary } from '@/api/summary';

export function useSummary(productId: number) {
   return useQuery({
      queryKey: ['summary', productId],
      queryFn: () => getSummary(productId),
   });
}
