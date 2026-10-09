import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateSummary } from '@/api/summary';

export function useGenerateSummary(productId: number) {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (force: boolean) => generateSummary(productId, force),
      onSuccess: (data) => {
         queryClient.setQueryData(['summary', productId], data);
      },
   });
}
