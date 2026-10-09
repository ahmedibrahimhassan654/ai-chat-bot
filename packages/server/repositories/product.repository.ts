import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export class ProductRepository {
   async getProduct(productId: number) {
      return prisma.product.findUnique({ where: { id: productId } });
   }
}

export const productRepository = new ProductRepository();
