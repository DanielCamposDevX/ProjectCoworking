import { errors } from '../errors/errors.js';
import { logsRepositories } from '../repositories/logs-repositories.js';
import { permissionRepositories } from '../repositories/permission-repositories.js';
import { projectsRepositories } from '../repositories/projects-repositories.js';
import { userRepositories } from '../repositories/user-repositories.js';
import { PermissionType } from '../types/permission-type.js';

async function getUserPermission(userId: number, projectId: number) {
   const userPermission = await permissionRepositories.getUserPermission(
      userId,
      projectId,
   );
   return userPermission;
}

async function createUserPermission(userId: number, projectId: number) {
   return await permissionRepositories.createUserPermission(userId, projectId);
}

async function updateUserPermission(
   userId: number,
   projectId: number,
   data: PermissionType,
) {
   const user = await userRepositories.findUserById(userId);
   if (!user) {
      throw errors.notFound('Usuário não encontrado');
   }
   const project = await projectsRepositories.getProjectById(projectId);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   if (project.created_by !== userId) {
      throw errors.unauthorized(
         'Usuário não tem permissão para editar permissões no projeto',
      );
   }
   const message = `Alterado permissões do usuário ${user.nome} no projeto ${project.nome}`;
   await logsRepositories.createLog(userId, project.id, message);
   return await permissionRepositories.updateUserPermission(
      userId,
      projectId,
      data,
   );
}

export const permissionServices = {
   getUserPermission,
   createUserPermission,
   updateUserPermission,
};
