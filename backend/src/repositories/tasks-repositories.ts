import { prisma } from '../config/database.js';

import { paramsType } from '../types/query-type.js';
import { taskType } from '../types/task-type.js';

async function getTasks(projectId: number, query?: paramsType) {
   const { page = 1, limit = 10 } = query || {};
   const skip = (page - 1) * limit;

   const total = await prisma.task.count({
      where: {
         projetoId: projectId,
      },
   });

   const tasks = await prisma.task.findMany({
      skip,
      take: limit,
      where: {
         projetoId: projectId,
      },
      include: {
         usuario: true,
         projeto: true,
      },
   });

   return { tasks, total };
}

async function createTask(
   data: taskType,
   usuarioId: number,
   projetoId: number,
) {
   const task = await prisma.task.create({
      data: {
         ...data,
         usuarioId,
         projetoId,
      },
   });
   return task;
}

async function updateTask(id: number, data: Partial<taskType>) {
   const updatedTask = await prisma.task.update({
      where: { id },
      data: {
         ...data,
      },
      include: {
         usuario: true,
         projeto: true,
      },
   });
   return updatedTask;
}

async function deleteTask(id: number) {
   await prisma.task.delete({
      where: { id },
   });
}

async function getTaskById(id: number) {
   const task = await prisma.task.findUnique({
      where: { id },
      include: {
         usuario: true,
         projeto: true,
      },
   });
   return task;
}

export const taskRepositories = {
   getTasks,
   createTask,
   updateTask,
   deleteTask,
   getTaskById,
};
