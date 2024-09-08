type statusProjeto = 'EM ANDAMENTO' | 'CONCLUIDO' | 'PENDENTE';

export type projectType = {
  id: number;
  nome: string;
  descricao?: string;
  status: statusProjeto;
  data_inicio: Date;
  data_fim?: Date;
};

export type updateProjectType = {
  nome?: string;
  descricao?: string;
  status?: statusProjeto;
  data_inicio?: Date;
  data_fim?: Date;
};
