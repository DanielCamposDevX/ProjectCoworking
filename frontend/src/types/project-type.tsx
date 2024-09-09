type statusProjeto = 'EM_ANDAMENTO' | 'CONCLUIDO' | 'PENDENTE';

export type projectType = {
  id: number;
  nome: string;
  descricao?: string;
  status: statusProjeto;
  data_inicio: Date;
  data_fim?: Date;
  created_by?: number;
  _count?: {
    usuarios: number;
  };
};

export type updateProjectType = {
  nome?: string;
  descricao?: string;
  status?: statusProjeto;
  data_inicio?: Date;
  data_fim?: Date;
  created_by?: number;
  _count?: {
    usuarios: number;
  };
};
