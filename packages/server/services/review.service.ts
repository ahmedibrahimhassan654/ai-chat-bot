import { reviewRepository } from '../repositories/review.repository.ts';
import { generateSummary } from './llm.service.ts';

export class ReviewService {
   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);

      if (reviews.length === 0) {
         return 'No reviews available to summarize.';
      }

      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      return generateSummary(joinedReviews);
   }
}

export const reviewService = new ReviewService();
