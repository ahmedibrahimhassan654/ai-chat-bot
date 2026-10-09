import { apiFetch } from './client';

export interface Product {
   id: number;
   name: string;
   description: string | null;
   price: string;
}

export function getProducts() {
   return apiFetch<Product[]>('/products');
}
