import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service.ts';

export class ReviewController {
   async summarizeReviews(req: Request, res: Response): Promise<void> {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      const summary = await reviewService.summarizeReviews(productId);

      res.json({ summary });
   }
}

export const reviewController = new ReviewController();
