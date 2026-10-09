import { reviewRepository } from '../repositories/review.repository.ts';
import { summaryRepository } from '../repositories/summary.repository.ts';
import { generateSummary } from './llm.service.ts';
import summarizeReviewsTemplate from '../prompts/summarize-reviews.txt' with { type: 'text' };

const REVIEWS_PLACEHOLDER = '{{reviews}}';

export class ReviewService {
   async summarizeReviews(productId: number, force = false): Promise<string> {
      if (!force) {
         const cached = await summaryRepository.getReviewSummary(productId);
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

      const summary = await generateSummary(prompt);

      await summaryRepository.storeReviewSummary(productId, summary);

      return summary;
   }
}

export const reviewService = new ReviewService();
