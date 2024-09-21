import { Router } from 'express';
import { logsControllers } from '../controllers/logs-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { queryValidations } from '../middlewares/query-validation.js';
import { queryParamsSchema } from '../schemas/query-schema.js';

const logsRouter = Router();

logsRouter.get(
   '/api/notifications',
   authUser,
   queryValidations(queryParamsSchema),
   logsControllers.getLogs,
);

export default logsRouter;
