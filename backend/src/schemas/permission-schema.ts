import Joi from 'joi';

export const permissionSchema = Joi.object({
   create: Joi.boolean().required().messages({
      'boolean.base': 'O campo create deve ser um booleano.',
      'any.required': 'O campo create é obrigatório.',
   }),
   update: Joi.boolean().required().messages({
      'boolean.base': 'O campo update deve ser um booleano.',
      'any.required': 'O campo update é obrigatório.',
   }),
   delete: Joi.boolean().required().messages({
      'boolean.base': 'O campo delete deve ser um booleano.',
      'any.required': 'O campo delete é obrigatório.',
   }),
});
