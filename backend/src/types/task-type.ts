import { StatusProjeto } from '@prisma/client';

export type taskType = {
   id: number;
   nome: string;
   descricao: string;
   term?: Date;
   status: StatusProjeto;
};
