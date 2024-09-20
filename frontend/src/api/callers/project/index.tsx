//React && Hooks
import { useQuery } from '@tanstack/react-query';

//Api
import * as api from '@/api/req/project';
import { completeprojectType } from '@/types/project-type';

export const useProject = (url: string) => {
  const key = ['project'];

  const index = useQuery<completeprojectType>({
    queryKey: key,
    queryFn: () => api.index(url),
  });

  return { index };
};
