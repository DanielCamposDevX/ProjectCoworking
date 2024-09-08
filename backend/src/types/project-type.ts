export type projectType = {
   nome: string;
   descricao?: string;
   status: string;
   data_inicio: Date;
   data_fim?: Date;
};

export type updateProjectType = {
   nome?: string;
   descricao?: string;
   status?: string;
   data_inicio?: Date;
   data_fim?: Date;
};
