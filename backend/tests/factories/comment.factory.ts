import { prisma } from '../../src/config/database';

export async function createFakeComment(userId: number, projectId: number) {
   return await prisma.comment.create({
      data: {
         texto: 'fake comment',
         usuarioId: userId,
         projetoId: projectId,
         data: new Date(),
      },
   });
}
