import { z } from "zod"

export const loginUserFormSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Digite seu email'),
  senha: z.string().min(1, 'Digite sua senha'),
})
export type loginUserFormData = z.infer<typeof loginUserFormSchema>




export const createUserFormSchema = z.object({
  email: z.string({message: 'Email é obrigatório'}).email('Email inválido'),
  senha: z.string({message: 'Senha é obrigatório'}).min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string({message: 'Confirmação de senha é obrigatório'}),
  nome: z.string({message: 'Nome é obrigatório'}).min(1, 'Digite seu nome'),
  papel: z.string({message: 'Papel é obrigatório'}),
}).refine(data => data.senha === data.confirmarSenha, { message: 'Senhas não são iguais', path: ['confirmarSenha'] }).transform(data => ({...data, confirmarSenha: undefined}))
export type createUserFormData = z.infer<typeof createUserFormSchema>
