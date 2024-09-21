import { Response } from 'express';
import { customRequest } from '../middlewares/jwt-verification';
import { logsServices } from '../services/logs-services';
import { userServices } from '../services/user-services';
import { paramsType } from '../types/query-type';

async function getLogs(
   req: customRequest & { query: paramsType },
   res: Response,
) {
   await userServices.getAuthUser(req.token, req.id);
   const logs = await logsServices.getLogs(req.id, req.query);
   res.status(200).json(logs);
}

export const logsControllers = { getLogs };
