import Joi from "joi";


export const userSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().required(),
  senha: Joi.string().required(),
  papel: Joi.string().required(),
})
