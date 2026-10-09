import type { Request, Response } from 'express';
import { getSummary } from '../services/summary.service.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class SummaryController {
   async getSummary(req: Request, res: Response): Promise<void> {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      try {
         const summary = await getSummary(productId);

         if (summary === null) {
            res.status(404).json({ error: 'Summary not found' });
            return;
         }

         res.json({ summary });
      } catch (error) {
         if (error instanceof NotFoundError) {
            res.status(404).json({ error: 'Product not found' });
         } else {
            res.status(500).json({ error: 'Failed to retrieve summary' });
         }
      }
   }
}

export const summaryController = new SummaryController();
