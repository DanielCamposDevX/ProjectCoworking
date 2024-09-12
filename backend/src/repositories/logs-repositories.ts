import { prisma } from 'config/database';

async function createLog(userId: number, projectId: number, action: string) {
   return await prisma.logs.create({
      data: {
         acao: action,
         data: new Date(),
         projetoId: projectId,
         usuarioId: userId,
      },
   });
}

export const logsRepositories = { createLog };
