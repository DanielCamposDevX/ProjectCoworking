/* eslint-disable @typescript-eslint/no-explicit-any */
//Utils
import { handleReq } from '@/api/handle';
import { paramsType } from '@/types/params-type';





export const index = async (url:string,query: paramsType) =>
  handleReq({
    method: 'get',
    url,
    query,
    showSuccess: false
  });
