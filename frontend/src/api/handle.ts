/* eslint-disable @typescript-eslint/no-explicit-any */
//Libs

import qs from 'qs';

//Utils
import api from '@/api';


//Types
import { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

type LastError = {
  message: string | undefined;
  date: Date | undefined;
};

const lastError: LastError = {
  message: undefined,
  date: undefined
};

export class CustomError extends Error {
  public data: any;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

const methods = {
  post: api.post,
  get: api.get,
  put: api.put,
  delete: api.delete
};

type HandleApiRequestParams = {
  url: string;
  body?: object;
  query?: Record<string, any>;
  params?: string | number;
  successMessage?: string;
  showSuccess?: boolean;
  method: keyof typeof methods;
  config?: AxiosRequestConfig;
  hideError?: boolean;
};

export const handleReq = async ({
  url,
  body,
  method,
  params,
  query,
  successMessage,
  config,
  showSuccess,
  hideError
}: HandleApiRequestParams) => {
  let composeUrl = url;
  composeUrl = params ? `${url}/${params}` : url;
  composeUrl = query ? `${composeUrl}?${qs.stringify(query)}` : composeUrl;

  if (method === 'get' && body)
    throw new Error('Body is not allowed in get method');

  const base = api.defaults.baseURL + composeUrl;
  console.log('Calling', `${method?.toUpperCase()}: ${base}`);

  const response = await methods[method](composeUrl, body, config)
    .then((res) => {
      showSuccess &&
        (successMessage) &&
        toast.success(successMessage);
      const data = res?.data;
      
      return data;
    })
    .catch(async (err) => {
      const res = err?.response?.data;
      console.log('Error', err, res);
      const status = err?.response?.status;

      if (status === 401) {
        toast.error('Usuário não autenticado');
        //// todo logout();
        return;
      }

      const genericError = 'Ops! Ocorreu um erro de conexão';

      const errorMessage = res?.error || genericError;
      const isGenericError = errorMessage === genericError;

      const isSameError = lastError.message === errorMessage && isGenericError;

      //Verify if erros has more then 5 seconds
      const timeToShow =
        !lastError.date ||  moment().diff(lastError.date, 'seconds') > 5;

      lastError.message = errorMessage;
      lastError.date = new Date();
      if (!isSameError || (isSameError && timeToShow)) {
        !hideError &&
          toast.error(errorMessage);
      }

      throw new CustomError(errorMessage, res);
    });
  return response;
};
