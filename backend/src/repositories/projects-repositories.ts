import { StatusProjeto } from '@prisma/client';
import { prisma } from '../config/database.js';
import { projectType, updateProjectType } from '../types/project-type.js';
import { paramsType } from '../types/query-type.js';

interface WhereClauseType {
   nome?: { contains: string };
   status?: StatusProjeto;
   usuarios?: { some: { id: number } };
   created_by?: number;
   data_inicio?: { gte?: Date };
   data_fim?: { lte?: Date };
   OR?: Array<{ created_by: number } | { usuarios: { some: { id: number } } }>;
}

async function getDashboard(userId: number, query?: paramsType) {
   const { data_inicio, data_fim, userId: queryUserId } = query || {};

   const projetos = await prisma.projeto.findMany({
      where: {
         usuarios: {
            some: {
               id: userId,
            },
         },
         ...(data_inicio || data_fim
            ? {
                 data_inicio: {
                    gte: data_inicio || undefined,
                 },
                 data_fim: {
                    lte: data_fim || undefined,
                 },
              }
            : {}),
         ...(queryUserId
            ? {
                 created_by: queryUserId,
              }
            : {}),
      },
      include: {
         Task: true,
         Comment: true,
         Logs: true,
         permissions: true,
      },
   });

   const dashboard = {
      totalProjetos: projetos.length,
      projetosEmAndamento: projetos.filter((p) => p.status === 'EM_ANDAMENTO')
         .length,
      projetosPendentes: projetos.filter((p) => p.status === 'PENDENTE').length,
      projetosConcluidos: projetos.filter((p) => p.status === 'CONCLUIDO')
         .length,
      tarefasPorProjeto: projetos.map((projeto) => projeto.Task),
      logsRecentes: projetos.flatMap((p) => p.Logs).slice(-5),
   };

   return dashboard;
}

async function getProjects(query: paramsType, userId: number) {
   const skip = (query.page - 1) * query.limit;

   const whereClause: WhereClauseType = {};

   if (query.search) {
      whereClause.nome = { contains: query.search };
   }
   if (query.status) {
      whereClause.status = query.status;
   }
   if (query.data_inicio) {
      whereClause.data_inicio = { gte: new Date(query.data_inicio) };
   }
   if (query.data_fim) {
      whereClause.data_fim = { lte: new Date(query.data_fim) };
   }
   if (query.userId) {
      whereClause.usuarios = { some: { id: query.userId } };
   }

   whereClause.OR = [
      { created_by: userId },
      { usuarios: { some: { id: userId } } },
   ];
   const [projects, totalProjects] = await prisma.$transaction([
      prisma.projeto.findMany({
         where: whereClause,
         orderBy: {
            [query.sortBy]: query.order,
         },
         include: {
            creator: {
               select: {
                  nome: true,
               },
            },
            _count: {
               select: {
                  usuarios: true,
               },
            },
         },
         skip,
         take: query.limit,
      }),
      prisma.projeto.count({
         where: whereClause,
      }),
   ]);

   const totalPages = Math.ceil(totalProjects / query.limit);

   return {
      projects,
      total: totalProjects,
      totalPages,
      currentPage: query.page,
   };
}

async function getProjectById(id: number) {
   return await prisma.projeto.findUnique({
      where: {
         id,
      },
   });
}

async function getEntireProjectById(id: number) {
   return await prisma.projeto.findUnique({
      where: {
         id,
      },
      include: {
         creator: true,
         usuarios: true,
      },
   });
}

async function createProject(data: projectType, userId: number) {
   return await prisma.projeto.create({
      data: {
         ...data,
         created_by: userId,
      },
      include: {
         creator: true,
      },
   });
}

async function updateProject(id: number, data: updateProjectType) {
   return await prisma.projeto.update({
      where: {
         id,
      },
      data,
      include: {
         creator: true,
      },
   });
}

async function deleteProject(id: number) {
   await prisma.permissions.deleteMany({
      where: {
         projetoId: id,
      },
   });
   await prisma.logs.deleteMany({
      where: {
         projetoId: id,
      },
   });
   return await prisma.projeto.delete({
      where: {
         id,
      },
   });
}

async function getProjectUsers(id: number, query?: paramsType) {
   const skip = (query.page - 1) * query.limit;
   const project = await prisma.projeto.findUnique({
      where: { id },
      select: {
         usuarios: {
            select: {
               id: true,
               nome: true,
               email: true,
               papel: true,
               permissions: true,
            },
            skip,
            take: query.limit,
         },
      },
   });

   const totalUsers = await prisma.usuario.count({
      where: {
         projetos: {
            some: {
               id,
            },
         },
      },
   });

   return { users: project.usuarios, total: totalUsers };
}

async function postProjectUsers(id: number, usuario_id: number) {
   return await prisma.projeto.update({
      where: {
         id,
      },
      data: {
         usuarios: {
            connect: {
               id: usuario_id,
            },
         },
      },
   });
}

async function deleteProjectUsers(userId: number) {
   return await prisma.projeto.update({
      where: {
         id: userId,
      },
      data: {
         usuarios: {
            disconnect: {
               id: userId,
            },
         },
      },
   });
}

export const projectsRepositories = {
   getProjects,
   getDashboard,
   createProject,
   updateProject,
   getProjectById,
   getEntireProjectById,
   deleteProject,
   getProjectUsers,
   deleteProjectUsers,
   postProjectUsers,
};
