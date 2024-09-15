import { StatusProjeto } from '@prisma/client';

export type projectType = {
   nome: string;
   descricao?: string;
   status: StatusProjeto;
   data_inicio: Date;
   data_fim?: Date;
};

export type updateProjectType = {
   nome?: string;
   descricao?: string;
   status?: StatusProjeto;
   data_inicio?: Date;
   data_fim?: Date;
};
export type completeprojectType = {
   id: number;
   nome: string;
   descricao?: string;
   status: StatusProjeto;
   data_inicio: Date;
   data_fim?: Date;
   usuarios: Array<{ id: number; papel: string }>;
};
