import Joi from "joi";


export const userSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().required(),
  senha: Joi.string().required(),
  papel: Joi.string().required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  senha: Joi.string().required(),
})
