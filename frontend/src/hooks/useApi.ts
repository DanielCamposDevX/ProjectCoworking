import { api } from "@/app/config/api";
import { AxiosError } from "axios";
import { useState } from "react";
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