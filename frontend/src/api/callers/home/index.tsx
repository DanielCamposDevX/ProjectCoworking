//React && Hooks
import { useInfiniteQuery } from '@tanstack/react-query';

//Api
import * as api from '@/api/req/home';
import { paramsType } from '@/types/params-type';
import { projectType } from '@/types/project-type';

export type Pagination = {
  projects: projectType[];
  currentPage: number;
  totalPages: number;
  total: number;
};

export const useHome = (query: paramsType) => {
  const key = ['home', query];

  const index = useInfiniteQuery({
    queryKey: key,
    queryFn: () => api.index(query),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Pagination) =>
      lastPage?.currentPage < lastPage.totalPages
        ? lastPage.currentPage * (query.limit || 10)
        : undefined,
  });

  return { index };
};
