import { Pagination, Query } from '@/types/Pagination';

export interface IUseCallerProps<T> {
  filters?: Query;
  enabled?: boolean;
  id?: string | null;
  show?: boolean;
  callbacks?: {
    index?: {
      onSuccess?: (data: Pagination<T>) => void;
      onError?: () => void;
    };
    show?: {
      onSuccess?: (data: T) => void;
      onError?: () => void;
    };
    create?: {
      onSuccess?: (data: T) => void;
      onError?: () => void;
    };
    update?: {
      onSuccess?: (data: T) => void;
      onError?: () => void;
    };
    status?: {
      onSuccess?: (data: Pagination<T>) => void;
      onError?: () => void;
    };
    destroy?: {
      onSuccess?: (data: Pagination<T> | T[]) => void;
      onError?: () => void;
    };
    set?: {
      onSuccess?: (data: T[]) => void;
      onError?: () => void;
    };
  };
}
