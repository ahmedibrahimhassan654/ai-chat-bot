import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export class SummaryRepository {
   async saveSummary(productId: number, content: string) {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      return prisma.summary.upsert({
         where: { productId },
         create: { productId, content, expiresAt },
         update: { content, expiresAt },
      });
   }
}

export const summaryRepository = new SummaryRepository();
