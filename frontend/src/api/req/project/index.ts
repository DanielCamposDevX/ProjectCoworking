/* eslint-disable @typescript-eslint/no-explicit-any */
//Utils
import { handleReq } from '@/api/handle';




export const index = async (url: string) =>
  handleReq({
    method: 'get',
    url,
    showSuccess: false
  });
