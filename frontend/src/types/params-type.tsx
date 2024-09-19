type orderType = 'asc' | 'desc';
type SortableFields = 'nome' | 'data_inicio' | 'data_fim' | 'status';
type StatusProjeto = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export type paramsType = {
  search?: string;
  page: number;
  limit?: number;
  userId?: number;
  userNome?: string;
  status?: StatusProjeto;
  data_inicio?: string;
  data_fim?: string;
  order?: orderType;
  sortBy?: SortableFields;
};
