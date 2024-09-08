import { z } from "zod";


export const createProjectFormSchema = z.object({
  nome: z.string({message: 'Nome é obrigatório'}).min(1, 'Digite o nome do projeto'),
  descricao: z.string({message: 'Descrição é obrigatório'}).min(1, 'Digite uma descrição'),
  data_inicio: z.string({message: 'Data de início é obrigatório'}),
  status: z.string().optional(),
})
export type createProjectFormData = z.infer<typeof createProjectFormSchema>


export const updateProjectFormSchema = z.object({
  nome: z.string({ message: 'Nome é obrigatório' })
    .min(1, 'Digite o nome do projeto'),
  descricao: z.string({ message: 'Descrição é obrigatória' })
    .min(1, 'Digite uma descrição').optional(), // Permite descrição vazia
  data_inicio: z.string({ message: 'Data de início é obrigatória' }),
  data_fim: z.string().optional(),
  status: z.string().optional(),
}).refine(data => {
  return data.data_fim === undefined || data.data_fim !== null;
}, {
  message: 'Data de fim não pode ser nula',
  path: ['data_fim'],
}).transform(data => ({
  ...data,
  data_inicio: new Date(data.data_inicio),
  data_fim: data.data_fim ? new Date(data.data_fim) : undefined,
}));

export type updateProjectFormData = z.infer<typeof updateProjectFormSchema>
