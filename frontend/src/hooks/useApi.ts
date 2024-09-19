import { api } from "@/config/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
export function usePost() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string| null>(null);
  const [loading, setLoading] = useState(false);

  const post = async ({ url, body}: { url: string; body: unknown }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(url,body)
      setResponse(res.data);
      return res.data;
    } catch (error) {
      setError((error as AxiosError).response?.data as string || 'Erro desconhecido');
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, post };
}

export function useGet({ url }: { url: string }) {
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string| null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    get({ newUrl: url });
  }, [url]);

  useEffect(() => {
    if(api.defaults.headers.common['Authorization']){
      get({});
    }
  },[api.defaults.headers.common['Authorization']]);

  const get = async ({newUrl,params}:{newUrl?: string, params?: unknown}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(newUrl || url, {params});
      setResponse(res.data);
      return res.data;
    } catch (error) {
      setError((error as AxiosError).response?.data as string || 'Erro desconhecido');
      return {}
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, get };
}