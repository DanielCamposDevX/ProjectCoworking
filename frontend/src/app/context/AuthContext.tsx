import { jwtDecode } from 'jwt-decode';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../config/api';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  userId: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('PM-token');
    if (storedToken) {
      setToken(storedToken);
      decodeToken(storedToken);
    }
  }, []);

  const decodeToken = (token: string) => {
    try {
      const decoded: {
        id: string;
      } = jwtDecode(token);
      setUserId(Number(decoded.id) || null);
    } catch (error) {
      console.error('Token inválido', error);
      setUserId(null);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('PM-token', token);
      decodeToken(token);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('PM-token');
      setUserId(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
