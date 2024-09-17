import Joi from 'joi';

export const permissionSchema = Joi.object({
   create: Joi.boolean().optional().messages({
      'boolean.base': 'O campo create deve ser um booleano.',
   }),
   update: Joi.boolean().optional().messages({
      'boolean.base': 'O campo update deve ser um booleano.',
   }),
   delete: Joi.boolean().optional().messages({
      'boolean.base': 'O campo delete deve ser um booleano.',
   }),
});
