import Joi from 'joi';
import { statusEnum } from './projects-schema';

export const queryParamsSchema = Joi.object({
   page: Joi.number()
      .optional()
      .default(1)
      .custom((value, helpers) => {
         const num = Number(value);
         if (Number.isNaN(num)) {
            return helpers.error('number.base');
         }
         return num;
      })
      .messages({
         'number.base': 'A página deve ser um número.',
      }),
   limit: Joi.number()
      .optional()
      .default(10)
      .custom((value, helpers) => {
         const num = Number(value);
         if (Number.isNaN(num)) {
            return helpers.error('number.base');
         }
         return num;
      })
      .messages({
         'number.base': 'O limite deve ser um número.',
      }),
   search: Joi.string().optional().default('').messages({
      'string.base': 'A busca deve ser uma string.',
   }),
   userId: Joi.number().optional().messages({
      'number.base': 'O ID do usuário deve ser um número.',
   }),
   data_inicio: Joi.date().optional().messages({
      'date.base': 'A data de início deve ser uma data válida.',
   }),
   data_fim: Joi.date().optional().messages({
      'date.base': 'A data de fim deve ser uma data válida.',
   }),
   status: Joi.string()
      .optional()
      .valid(...statusEnum)
      .messages({
         'any.only': 'O status deve ser um dos seguintes valores: {#valids}.',
         'any.required': 'O campo status é obrigatório.',
      }),
   order: Joi.string().optional().valid('asc', 'desc').default('asc').messages({
      'any.only': 'A ordenação deve ser "asc" ou "desc".',
   }),
   sortBy: Joi.string()
      .optional()
      .valid('nome', 'data_inicio', 'data_fim', 'status')
      .default('nome')
      .messages({
         'any.only': 'Os campos ordenáveis são: {#valids}.',
      }),
});
