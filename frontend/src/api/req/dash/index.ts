/* eslint-disable @typescript-eslint/no-explicit-any */
//Utils
import { handleReq } from '@/api/handle';
import { paramsType } from '@/types/params-type';

const url = '/api/projetos/dashboard';



export const index = async (query: paramsType) =>
  handleReq({
    method: 'get',
    url,
    query,
    showSuccess: false
  });
