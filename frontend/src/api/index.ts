
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  async (config) => {
    const token =  localStorage.getItem('PM-token');

    config.timeout = 20000;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    toast.error('Erro ao se conectar com o servidor');
    throw new Error(error);
  }
);

export default api;
