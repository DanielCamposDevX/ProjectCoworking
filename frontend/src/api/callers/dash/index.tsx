//React && Hooks
import { useQuery } from '@tanstack/react-query';

//Api
import * as api from '@/api/req/dash';
import { logsType } from '@/types/logs-type';
import { paramsType } from '@/types/params-type';
import { taskType } from '@/types/task-type';

export type dashType = {
  totalProjetos: number;
  projetosEmAndamento: number;
  projetosPendentes: number;
  projetosConcluidos: number;
  tarefasPorProjeto: taskType[];
  logsRecentes: logsType[];
};

export const useDashboard = (query: paramsType) => {
  const key = ['dash', query];

  const index = useQuery<dashType>({
    queryKey: key,
    queryFn: () => api.index(query),
  });

  return { index };
};
