import { useQuery } from '@tanstack/react-query';
import { getReviews } from '@/api/reviews';

export function useReviews(productId: number) {
   return useQuery({
      queryKey: ['reviews', productId],
      queryFn: () => getReviews(productId),
   });
}
