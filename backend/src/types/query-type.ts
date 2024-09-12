import { StatusProjeto } from '@prisma/client';

type orderType = 'asc' | 'desc';
type SortableFields = 'nome' | 'data_inicio' | 'data_fim' | 'status';

export type paramsType = {
   search: string;
   page: number;
   limit: number;
   userId?: number;
   status?: StatusProjeto;
   data_inicio?: Date;
   data_fim?: Date;
   order?: orderType;
   sortBy?: SortableFields;
};
