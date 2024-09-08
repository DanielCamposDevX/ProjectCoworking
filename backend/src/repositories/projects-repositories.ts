import { projectType, updateProjectType } from 'types/project-type';
import { prisma } from '../config/database';

async function getProjects(page: number, limit: number) {
   const skip = (page - 1) * limit;

   const [projects, totalProjects] = await prisma.$transaction([
      prisma.projeto.findMany({
         skip,
         take: limit,
      }),
      prisma.projeto.count(),
   ]);

   return { projects, total: totalProjects };
}

async function getProjectById(id: number) {
   return await prisma.projeto.findUnique({
      where: {
         id,
      },
   });
}

async function createProject(data: projectType) {
   return await prisma.projeto.create({
      data,
   });
}

async function updateProject(id: number, data: updateProjectType) {
   return await prisma.projeto.update({
      where: {
         id,
      },
      data,
   });
}

async function deleteProject(id: number) {
   return await prisma.projeto.delete({
      where: {
         id,
      },
   });
}

async function getProjectUsers(id: number, page: number, limit: number) {
   const skip = (page - 1) * limit;
   const project = await prisma.projeto.findUnique({
      where: { id },
      select: {
         usuarios: {
            select: {
               id: true,
            },
            skip,
            take: limit,
         },
      },
   });

   const userDetails = await prisma.usuario.findMany({
      where: {
         id: { in: project.usuarios.map((user) => user.id) },
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

   return { users: userDetails, total: totalUsers };
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
   createProject,
   updateProject,
   getProjectById,
   deleteProject,
   getProjectUsers,
   deleteProjectUsers,
   postProjectUsers,
};
