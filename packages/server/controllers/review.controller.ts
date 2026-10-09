import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class ReviewController {
   async summarizeReviews(req: Request, res: Response): Promise<void> {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      try {
         const force = req.query.force === 'true';
         const summary = await reviewService.summarizeReviews(productId, force);
         res.json({ summary });
      } catch (error) {
         if (error instanceof NotFoundError) {
            res.status(404).json({ error: 'Product not found' });
         } else {
            res.status(500).json({ error: 'Failed to generate summary' });
         }
      }
   }
}

export const reviewController = new ReviewController();
