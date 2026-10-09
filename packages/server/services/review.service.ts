import { reviewRepository } from '../repositories/review.repository.ts';

export class ReviewService {
   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');
      // Here you would typically call an AI service to summarize the reviews.

      // For now, we'll just return a placeholder summary.
      return 'This is a placeholder summary.';
   }
}

export const reviewService = new ReviewService();
