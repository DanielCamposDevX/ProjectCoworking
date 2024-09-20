//React && Hooks
import { useInfiniteQuery } from '@tanstack/react-query';

//Api
import * as api from '@/api/req/comments';
import { commentType } from '@/types/comment-type';
import { paramsType } from '@/types/params-type';


type responseType = {
  comments: commentType[];
  total: number;
};

export const useComments = (url:string,query: paramsType) => {
  const key = ['comment', query];

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
