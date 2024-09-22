import { prisma } from '../config/database.js';
import { io } from '../server.js';
import { paramsType } from '../types/query-type.js';

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
   newLog.projeto.usuarios.forEach((user) => {
      io.to(user.id.toString()).emit('log', {
         acao: action,
         data: new Date(),
      });
   });

   return newLog;
}

async function getLogs(userId: number, query?: paramsType) {
   const { limit = 5 } = query || {};

   const logs = await prisma.logs.findMany({
      orderBy: {
         data: 'desc',
      },
      take: limit,
      where: {
         usuarioId: userId,
      },
      select: {
         data: true,
         acao: true,
      },
   });

   return logs;
}

export const logsRepositories = { getLogs, createLog };
