import 'dotenv/config';
import { generationPrompt } from '../config/openai.js';
import { errors } from '../errors/errors.js';
import { logsRepositories } from '../repositories/logs-repositories.js';
import { projectsRepositories } from '../repositories/projects-repositories.js';
import { taskRepositories } from '../repositories/tasks-repositories.js';
import { taskType } from '../types/task-type.js';

import { userRepositories } from '../repositories/user-repositories.js';
import { paramsType } from '../types/query-type.js';
import { sendNotificationMail } from '../utils/sendMail.js';
import { permissionServices } from './permission-services.js';

async function getTasks(projectId: number, query?: paramsType) {
   const tasks = await taskRepositories.getTasks(projectId, query);
   return tasks;
}

async function createTask(data: taskType, userId: number, projectId: number) {
   const project = await projectsRepositories.getProjectById(projectId);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   const user = await userRepositories.findUserById(userId);
   if (!user) {
      throw errors.notFound('Usuário não encontrado');
   }
   if (project.created_by !== userId) {
      const permissions = await permissionServices.getUserPermission(
         userId,
         projectId,
      );
      if (!permissions || !permissions.create) {
         throw errors.unauthorized(
            'Usuário não tem permissão para criar tarefas no projeto',
         );
      }
   }
   const task = await taskRepositories.createTask(data, userId, projectId);
   const message = `Tarefa criada por ${user.nome} no projeto ${project.nome}`;
   await logsRepositories.createLog(userId, projectId, message);
   await sendNotificationMail({
      projectId,
      text: message,
   });
   return task;
}

async function updateTask(id: number, data: Partial<taskType>) {
   const task = await taskRepositories.getTaskById(id);
   if (!task) {
      throw errors.notFound('Tarefa não encontrada');
   }

   const updatedTask = await taskRepositories.updateTask(id, data);
   const message = `${updatedTask.usuario.nome} editou uma tarefa em ${updatedTask.projeto.nome}`;
   await logsRepositories.createLog(
      task.usuario.id,
      updatedTask.projeto.id,
      message,
   );
   await sendNotificationMail({
      projectId: updatedTask.projeto.id,
      text: message,
   });
   return updatedTask;
}

async function deleteTask(id: number) {
   const task = await taskRepositories.getTaskById(id);
   if (!task) {
      throw errors.notFound('Tarefa não encontrada');
   }
   await taskRepositories.deleteTask(id);
   const message = `${task.usuario.nome} deletou uma tarefa em ${task.projeto.nome}`;
   await logsRepositories.createLog(task.usuarioId, task.projetoId, message);
   await sendNotificationMail({
      projectId: task.projetoId,
      text: message,
   });
}

async function getTask(id: number) {
   const task = await taskRepositories.getTaskById(id);
   if (!task) {
      throw errors.notFound('Tarefa não encontrada');
   }
   return task;
}

async function generateTasks(projectId: number) {
   const project = await projectsRepositories.getEntireProjectById(projectId);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   const prompt = generationPrompt(project);
   const response = "Response"

   const result = JSON.parse(response.trim());

   if (!result.tarefas || !result.comentarios) {
      const newResponse = "Response 2"
      const newResult = JSON.parse(
         newResponse.trim(),
      );
      if (!newResult.tarefas || !newResult.comentarios) {
         throw errors.internalServerError(
            'Não foi possível gerar tarefas e comentários',
         );
      }
      return newResult;
   }

   return result;
}

export const taskServices = {
   getTasks,
   createTask,
   updateTask,
   deleteTask,
   getTask,
   generateTasks,
};
