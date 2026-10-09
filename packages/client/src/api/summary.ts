import { apiFetch } from './client';

export interface SummaryResponse {
   summary: string;
}

export function getSummary(productId: number) {
   return apiFetch<SummaryResponse>(`/products/${productId}/summary`);
}

export function generateSummary(productId: number, force = false) {
   return apiFetch<SummaryResponse>(
      `/products/${productId}/reviews/summarize${force ? '?force=true' : ''}`,
      { method: 'POST' }
   );
}
