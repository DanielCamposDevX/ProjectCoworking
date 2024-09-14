import Joi from 'joi';

export const commentSchema = Joi.object({
   texto: Joi.string().required().max(50).messages({
      'string.base': 'O texto deve ser uma string.',
      'string.empty': 'O campo texto é obrigatório.',
      'any.required': 'O campo texto é obrigatório.',
      'string.max': 'O texto deve ter no máximo {#limit} caracteres.',
   }),
});
