import csvParser from 'csv-parser';
import 'dotenv/config';
import moment from 'moment';
import { createReadStream } from 'node:fs';
import { errors } from '../errors/errors.js';
import { logsRepositories } from '../repositories/logs-repositories.js';
import { projectsRepositories } from '../repositories/projects-repositories';
import { userRepositories } from '../repositories/user-repositories.js';
import { projectType, updateProjectType } from '../types/project-type.js';
import { paramsType } from '../types/query-type.js';
import { deleteCSVFile } from '../utils/deleteCsv.js';
import { sendNotificationMail } from '../utils/sendMail.js';
import { statusParser } from '../utils/statusParse.js';
import { permissionServices } from './permission-services.js';

async function getDashboard(userId: number, query?: paramsType) {
   const projects = await projectsRepositories.getDashboard(userId, query);
   return projects;
}

async function getProjects(userId: number, query: paramsType) {
   const projects = await projectsRepositories.getProjects(query, userId);
   return projects;
}

async function getProjectById(id: number) {
   const project = await projectsRepositories.getEntireProjectById(id);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   return project;
}

async function createProject(data: projectType, userId: number) {
   data.data_inicio = new Date(data.data_inicio);
   const project = await projectsRepositories.createProject(data, userId);
   const message = `Projeto ${project.nome} criado por ${project.creator.nome}`;
   await logsRepositories.createLog(userId, project.id, message);
   await sendNotificationMail({
      projectId: project.id,
      text: message,
   });
   return project;
}

async function processCSV(
   filePath: string,
   userId: number,
): Promise<{ message: string; projetos: projectType[] }> {
   const projetos: projectType[] = [];
   let linhaAtual = 0;

   return new Promise((resolve, reject) => {
      createReadStream(filePath)
         .pipe(csvParser({ separator: ';' }))
         .on('data', (row) => {
            linhaAtual += 1;

            if (!row.nome || !row.data_inicio || !row.status) {
               return reject(
                  errors.unprocEntity(
                     `Linha ${linhaAtual}: Campos obrigatórios não preenchidos`,
                  ),
               );
            }

            const dataInicio = moment(row.data_inicio, 'YYYY-MM-DD', true);
            if (!dataInicio.isValid()) {
               return reject(
                  errors.unprocEntity(
                     `Linha ${linhaAtual}: A planilha contém campos de data inválidos`,
                  ),
               );
            }

            if (row.data_inicio && row.data_fim) {
               const dateInicio = new Date(row.data_inicio);
               const dataFim = new Date(row.data_fim);

               if (dateInicio > dataFim) {
                  return reject(
                     errors.unprocEntity(
                        `Linha ${linhaAtual}:Data de início não pode ser maior que a data de fim`,
                     ),
                  );
               }
            }

            const projeto: projectType = {
               nome: row.nome,
               descricao: row.descricao || null,
               data_inicio: dataInicio.toDate(),
               data_fim: row.data_fim
                  ? moment(row.data_fim, 'YYYY-MM-DD', true).toDate()
                  : null,
               status: statusParser(row.status),
            };

            projetos.push(projeto);
         })
         .on('end', async () => {
            try {
               await Promise.all(
                  projetos.map((projeto) =>
                     projectsRepositories.createProject(projeto, userId),
                  ),
               );
               deleteCSVFile(filePath);
               resolve({ message: 'CSV processado com sucesso', projetos });
            } catch (error) {
               reject(errors.unprocEntity(error.message));
            }
         })
         .on('error', (error) => {
            reject(errors.unprocEntity(error.message));
         });
   });
}

async function updateProject(
   id: number,
   userId: number,
   data: updateProjectType,
) {
   const project = await projectsRepositories.getProjectById(id);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   if (project.created_by !== userId) {
      const permissions = await permissionServices.getUserPermission(
         userId,
         id,
      );
      if (!permissions || !permissions.update) {
         throw errors.unauthorized(
            'Usuário não tem permissão para editar o projeto',
         );
      }
   }
   if (data.data_inicio && data.data_fim) {
      const dataInicio = new Date(data.data_inicio);
      const dataFim = new Date(data.data_fim);

      if (dataInicio > dataFim) {
         throw errors.badRequest(
            'Data de início não pode ser maior que a data de fim',
         );
      }
   }

   if (data.data_inicio && project.data_fim && !data.data_fim) {
      const dataInicio = new Date(data.data_inicio);
      const dataFim = new Date(project.data_fim);

      if (dataInicio > dataFim) {
         throw errors.badRequest(
            'Data de início não pode ser maior que a data de fim',
         );
      }
   }

   if (data.data_fim && project.data_inicio && !data.data_inicio) {
      const dataFim = new Date(data.data_fim);
      const dataInicio = new Date(project.data_inicio);

      if (dataFim < dataInicio) {
         throw errors.badRequest(
            'Data de fim não pode ser anterior à data de início',
         );
      }
   }

   const finalProject = await projectsRepositories.updateProject(id, data);
   const user = await userRepositories.findUserById(userId);
   const message = `Projeto ${project.nome} atualizado por ${user.id}`;
   await logsRepositories.createLog(userId, project.id, message);
   await sendNotificationMail({
      projectId: project.id,
      text: message,
   });
   return finalProject;
}

async function deleteProject(userId: number, id: number) {
   const project = await projectsRepositories.getProjectById(id);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   if (project.created_by !== userId) {
      const permissions = await permissionServices.getUserPermission(
         userId,
         id,
      );
      if (!permissions || !permissions.delete) {
         throw errors.unauthorized(
            'Usuário não tem permissão para remover o projeto',
         );
      }
   }
   await projectsRepositories.deleteProject(id);
}

async function getProjectUsers(id: number, query?: paramsType) {
   const project = await projectsRepositories.getProjectById(id);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   const users = await projectsRepositories.getProjectUsers(id, query);
   return users;
}

async function postProjectUsers(id: number, userId: number, creatorId: number) {
   const user = await userRepositories.findUserById(userId);
   if (!user) {
      throw errors.notFound('Usuário não encontrado');
   }
   const project = await projectsRepositories.getProjectById(id);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   if (project.created_by !== creatorId) {
      const permissions = await permissionServices.getUserPermission(
         userId,
         id,
      );
      if (!permissions || !permissions.create) {
         throw errors.unauthorized(
            'Usuário não tem permissão para vincular pessoas ao projeto',
         );
      }
   }
   await projectsRepositories.postProjectUsers(id, userId);
   await permissionServices.createUserPermission(userId, id);
   const message = `${user.nome} adicionado no projeto ${project.nome}`;
   await logsRepositories.createLog(userId, project.id, message);
   await sendNotificationMail({
      projectId: project.id,
      text: message,
   });
   return user;
}

async function deleteProjectUsers(
   id: number,
   userId: number,
   reqUserId: number,
) {
   const user = await userRepositories.findUserById(userId);
   if (!user) {
      throw errors.notFound('Usuário não encontrado');
   }
   const project = await projectsRepositories.getProjectById(id);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   if (project.created_by !== reqUserId) {
      const permissions = await permissionServices.getUserPermission(
         userId,
         id,
      );
      if (!permissions || !permissions.delete) {
         throw errors.unauthorized(
            'Usuário não tem permissão para remover pessoas do projeto',
         );
      }
   }
   const message = `${user.nome} removido do projeto ${project.nome}`;
   await logsRepositories.createLog(userId, project.id, message);
   await sendNotificationMail({
      projectId: project.id,
      text: message,
   });
   await projectsRepositories.deleteProjectUsers(id, userId);
}

export const projectServices = {
   getProjects,
   getProjectById,
   getDashboard,
   createProject,
   processCSV,
   updateProject,
   deleteProject,
   getProjectUsers,
   postProjectUsers,
   deleteProjectUsers,
};
