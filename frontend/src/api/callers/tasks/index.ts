//React && Hooks
import { useInfiniteQuery } from '@tanstack/react-query';

//Api
import * as api from '@/api/req/tasks';
import { paramsType } from '@/types/params-type';
import { taskType } from '@/types/task-type';


type responseType = {
  tasks: taskType[];
  total: number;
};

export const useTasks = (url:string,query: paramsType) => {
  const key = ['tasks', query];

  const index = useInfiniteQuery({
    queryKey: key,
    queryFn: () => api.index(url,query),
    initialPageParam: 1,
    getNextPageParam: (lastPage: responseType) =>
      query.page - 1 < Math.ceil(lastPage.total / (query.limit || 5))
        ? query.page - 1 * (query.limit || 5)
        : undefined,
  });

  return { index };
};
