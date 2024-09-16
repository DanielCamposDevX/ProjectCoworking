import { statusProjeto } from './project-type';

export type taskType = {
  id: number;
  nome: string;
  descricao: string;
  term?: Date;
  status: statusProjeto;
  usuarioId: number;
  usuario: {
    nome: string;
    id: number;
  };
  projeto: {
    nome: string;
    id: number;
  };
  projetoId: number;
};
