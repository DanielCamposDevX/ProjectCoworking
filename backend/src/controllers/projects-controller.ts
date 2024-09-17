import { Response } from 'express';
import { customRequest } from '../middlewares/jwt-verification.js';
import { projectServices } from '../services/projects-services.js';
import { userServices } from '../services/user-services.js';
import { paramsType } from '../types/query-type.js';

async function getDashboard(
   req: customRequest & { query: paramsType },
   res: Response,
) {
   await userServices.getAuthUser(req.token, req.id);
   const projects = await projectServices.getDashboard(req.id, req.query);
   res.status(200).json(projects);
}

async function getProjects(
   req: customRequest & { query: paramsType },
   res: Response,
) {
   await userServices.getAuthUser(req.token, req.id);
   const projects = await projectServices.getProjects(req.id, req.query);
   res.status(200).json(projects);
}

async function getProjectById(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const project = await projectServices.getProjectById(Number(req.params.id));
   res.status(200).json(project);
}

async function createProject(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const project = await projectServices.createProject(req.body, req.id);
   res.status(201).json(project);
}

async function uploadCSV(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const filePath = req.file?.path;
   if (!filePath) {
      return res.status(400).json({ message: 'Arquivo não fornecido' });
   }

   const result = await projectServices.processCSV(filePath, req.id);
   res.status(200).json(result);
}

async function updateProject(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const project = await projectServices.updateProject(
      Number(req.params.id),
      req.id,
      req.body,
   );
   res.status(200).json(project);
}

async function deleteProject(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   await projectServices.deleteProject(req.id, Number(req.params.id));
   res.status(204).send();
}

async function getProjectUsers(
   req: customRequest & { query: paramsType },
   res: Response,
) {
   await userServices.getAuthUser(req.token, req.id);
   if (req.query.page && req.query.limit) {
      const users = await projectServices.getProjectUsers(
         Number(req.params.id),
         req.query,
      );
      res.status(200).json(users);
   } else {
      const users = await projectServices.getProjectUsers(
         Number(req.params.id),
      );
      res.status(200).json(users);
   }
}

async function postProjectUsers(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const user = await projectServices.postProjectUsers(
      Number(req.params.id),
      Number(req.body.usuario_id),
      Number(req.id),
   );
   res.status(200).json(user);
}

async function deleteProjectUsers(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   if (Number.isNaN(Number(req.params.usuario_id))) {
      res.status(400).send('Usuário inválido');
   }
   await projectServices.deleteProjectUsers(
      Number(req.params.id),
      Number(req.params.usuario_id),
      Number(req.id),
   );
   res.status(204).send();
}

export const projectControllers = {
   getProjects,
   getProjectById,
   getDashboard,
   uploadCSV,
   createProject,
   updateProject,
   deleteProject,
   getProjectUsers,
   postProjectUsers,
   deleteProjectUsers,
};
