import { z } from "zod"


export const createProjectFormSchema = z.object({
  nome: z.string({message: 'Nome é obrigatório'}).min(1, 'Digite o nome do projeto'),
  descricao: z.string({message: 'Descrição é obrigatório'}).min(1, 'Digite uma descrição'),
  data_inicio: z.string({message: 'Data de início é obrigatório'}),
  status: z.string().optional(),
})
export type createProjectFormData = z.infer<typeof createProjectFormSchema>
