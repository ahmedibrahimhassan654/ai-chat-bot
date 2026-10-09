import { apiFetch } from './client';

export interface Review {
   id: number;
   author: string;
   rating: number;
   content: string;
   createdAt: string;
   productId: number;
}

export function getReviews(productId: number) {
   return apiFetch<Review[]>(`/products/${productId}/reviews`);
}
