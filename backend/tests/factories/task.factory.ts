import { prisma } from '../../src/config/database';

export async function createFakeTask(userId: number, projectId: number) {
   return await prisma.task.create({
      data: {
         nome: 'fake task',
         descricao: 'fake task description',
         status: 'PENDENTE',
         usuarioId: userId,
         projetoId: projectId,
      },
   });
}
