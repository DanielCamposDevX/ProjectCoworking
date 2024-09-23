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

   const projects = await prisma.projeto.findMany({
      where: {
         usuarios: {
            some: {
               id: userId,
            },
         },
      },
      select: {
         Logs: {
            orderBy: {
               data: 'desc',
            },
            take: limit,
         },
      },
   });

   const allLogs = projects.flatMap((p) => p.Logs);
   const sortedLogs = allLogs.sort(
      (a, b) => b.data.getTime() - a.data.getTime(),
   );

   return sortedLogs.slice(0, limit);
}

export const logsRepositories = { getLogs, createLog };
