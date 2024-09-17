import moment from "moment";
import { z } from "zod";


export const createTaskFormSchema = z.object({
  nome: z.string({message: 'Nome é obrigatório'}).min(1, 'Digite o nome do projeto'),
  descricao: z.string({message: 'Descrição é obrigatório'}).min(1, 'Digite uma descrição'),
  status: z.string().optional(),
  term: z.string().optional().transform(value => moment(value).toISOString() || undefined),
})
export type createTaskFormData = z.infer<typeof createTaskFormSchema>
