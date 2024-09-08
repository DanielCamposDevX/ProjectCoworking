import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;
export async function connectDb(): Promise<void> {
   prisma = new PrismaClient();
   try {
      await prisma.$connect();
   } catch (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      throw err;
   }
}

export async function disconnectDB(): Promise<void> {
   await prisma?.$disconnect();
}
