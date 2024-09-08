import Joi from 'joi';

const statusEnum = ['Pendente', 'Em andamento', 'Concluído'];

export const projectSchema = Joi.object({
   nome: Joi.string().required(),
   descricao: Joi.string().optional(),
   data_inicio: Joi.string().isoDate().required(),
   status: Joi.string()
      .valid(...statusEnum)
      .required(),
});

export const updateProjectSchema = Joi.object({
   nome: Joi.string().optional(),
   descricao: Joi.string().optional(),
   data_inicio: Joi.string().isoDate().optional(),
   data_fim: Joi.string().isoDate().optional(),
   status: Joi.string()
      .valid(...statusEnum)
      .optional(),
});

export const projectUserSchema = Joi.object({
   usuario_id: Joi.number().required(),
});
