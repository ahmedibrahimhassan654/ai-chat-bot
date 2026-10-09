import { reviewRepository } from '../repositories/review.repository.ts';
import { summaryRepository } from '../repositories/summary.repository.ts';
import { productRepository } from '../repositories/product.repository.ts';
import { generateSummary } from './llm.service.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import summarizeReviewsTemplate from '../prompts/summarize-reviews.txt' with { type: 'text' };

const REVIEWS_PLACEHOLDER = '{{reviews}}';

export class ReviewService {
   async summarizeReviews(productId: number, force = false): Promise<string> {
      const product = await productRepository.getProduct(productId);
      if (!product) {
         throw new NotFoundError('Product not found');
      }

      if (!force) {
         const cached =
            await summaryRepository.getSummaryByProductId(productId);
         if (cached) {
            return cached.content;
         }
      }

      const reviews = await reviewRepository.getReviews(productId, 10);

      if (reviews.length === 0) {
         return 'No reviews available to summarize.';
      }

      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const prompt = summarizeReviewsTemplate.replaceAll(
         REVIEWS_PLACEHOLDER,
         joinedReviews
      );

      try {
         const summary = await generateSummary(prompt);
         await summaryRepository.storeReviewSummary(productId, summary);
         return summary;
      } catch (error) {
         console.error('LLM generation failed:', error);
         return 'Unable to generate summary at this time. Please try again later.';
      }
   }
}

export const reviewService = new ReviewService();
