import { prisma } from 'config/database';
import { PermissionType } from 'types/permission-type';

async function getUserPermission(userId: number, projectId: number) {
   return await prisma.permissions.findUnique({
      where: {
         usuarioId_projetoId: {
            usuarioId: userId,
            projetoId: projectId,
         },
      },
   });
}

async function createUserPermission(userId: number, projectId: number) {
   return await prisma.permissions.create({
      data: {
         usuarioId: userId,
         projetoId: projectId,
         create: false,
         update: false,
         delete: false,
      },
   });
}

async function updateUserPermission(
   userId: number,
   projectId: number,
   data: PermissionType,
) {
   return await prisma.permissions.update({
      where: {
         usuarioId_projetoId: {
            usuarioId: userId,
            projetoId: projectId,
         },
      },
      data,
   });
}

export const permissionRepositories = {
   getUserPermission,
   createUserPermission,
   updateUserPermission,
};
