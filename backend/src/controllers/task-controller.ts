import { Response } from 'express';
import { customRequest } from '../middlewares/jwt-verification.js';
import { taskServices } from '../services/task-services.js';
import { userServices } from '../services/user-services.js';
import { paramsType } from '../types/query-type.js';

async function getTasks(
   req: customRequest & { query: paramsType },
   res: Response,
) {
   await userServices.getAuthUser(req.token, req.id);
   const task = await taskServices.getTasks(Number(req.params.id), req.query);
   res.status(200).json(task);
}

async function createTask(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const task = await taskServices.createTask(
      req.body,
      req.id,
      Number(req.params.id),
   );
   res.status(201).json(task);
}

async function updateTask(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const task = await taskServices.updateTask(Number(req.params.id), req.body);
   res.status(200).json(task);
}

async function deleteTask(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   await taskServices.deleteTask(Number(req.params.id));
   res.status(204).send();
}

async function getTask(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const task = await taskServices.getTask(Number(req.params.id));
   res.status(200).json(task);
}

async function generateTasks(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   if (!req.params.id || Number.isNaN(Number(req.params.id))) {
      res.status(400).json({ message: 'Project ID is required' });
   }
   const result = await taskServices.generateTasks(Number(req.params.id));
   res.status(200).json(result);
}

export const taskControllers = {
   getTasks,
   createTask,
   updateTask,
   deleteTask,
   getTask,
   generateTasks,
};
