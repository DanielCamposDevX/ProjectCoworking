import { prisma } from '../config/database.js';
import { io } from '../server.js';

async function createLog(userId: number, projectId: number, action: string) {
   const newLog = await prisma.logs.create({
      data: {
         acao: action,
         data: new Date(),
         projetoId: projectId,
         usuarioId: userId,
      },
      select: {
         projeto: {
            select: {
               usuarios: {
                  select: {
                     id: true,
                  },
               },
            },
         },
      },
   });
   newLog.projeto.usuarios.forEach((user) =>
      io.to(user.id.toString()).emit('log', newLog),
   );

   return newLog;
}

export const logsRepositories = { createLog };
