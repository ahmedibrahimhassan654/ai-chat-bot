import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export class SummaryRepository {
   async saveSummary(productId: number, content: string) {
      return prisma.summary.upsert({
         where: { productId },
         create: { productId, content },
         update: { content },
      });
   }
}

export const summaryRepository = new SummaryRepository();
