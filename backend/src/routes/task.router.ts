import { Router } from 'express';
import { taskControllers } from '../controllers/task-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { queryValidations } from '../middlewares/query-validation.js';
import { validate } from '../middlewares/schema-validation.js';
import { queryParamsSchema } from '../schemas/query-schema.js';
import { taskSchema } from '../schemas/task-schema.js';

const taskRouter = Router();

taskRouter
   .get(
      '/api/projetos/:id/tarefas',
      authUser,
      queryValidations(queryParamsSchema),
      taskControllers.getTasks,
   )
   .post(
      '/api/projetos/:id/tarefas',
      authUser,
      validate(taskSchema),
      taskControllers.createTask,
   )
   .put(
      '/api/projetos/tarefas/:id',
      authUser,
      validate(taskSchema),
      taskControllers.updateTask,
   )
   .delete('/api/projetos/tarefas/:id', authUser, taskControllers.deleteTask);

export default taskRouter;
