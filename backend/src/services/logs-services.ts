import { logsRepositories } from '../repositories/logs-repositories';
import { paramsType } from '../types/query-type';

async function getLogs(userId: number, query?: paramsType) {
   const logs = await logsRepositories.getLogs(userId, query);
   return logs;
}

export const logsServices = { getLogs };
