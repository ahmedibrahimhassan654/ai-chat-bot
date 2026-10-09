import { productRepository } from '../repositories/product.repository.ts';
import { summaryRepository } from '../repositories/summary.repository.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export async function getSummary(productId: number): Promise<string | null> {
   const product = await productRepository.getProduct(productId);
   if (!product) {
      throw new NotFoundError('Product not found');
   }

   const summary = await summaryRepository.getSummaryByProductId(productId);
   return summary?.content ?? null;
}
