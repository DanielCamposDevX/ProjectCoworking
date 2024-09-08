import { Response } from 'express';
import { customRequest } from '../middlewares/jwt-verification.js';
import { projectServices } from '../services/projects-services.js';
import { userServices } from '../services/user-services.js';

async function getProjects(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   req.query.page = req.query.page || '1';
   req.query.limit = req.query.limit || '10';
   const projects = await projectServices.getProjects(
      Number(req.query.page),
      Number(req.query.limit),
   );
   res.status(200).json(projects);
}

async function createProject(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const project = await projectServices.createProject(req.body);
   res.status(201).json(project);
}

async function updateProject(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const project = await projectServices.updateProject(
      Number(req.params.id),
      req.body,
   );
   res.status(200).json(project);
}

async function deleteProject(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   await projectServices.deleteProject(Number(req.params.id));
   res.status(204).send();
}

async function getProjectUsers(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   if (req.query.page && req.query.limit) {
      const users = await projectServices.getProjectUsers(
         Number(req.params.id),
         Number(req.query.page),
         Number(req.query.limit),
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
   );
   res.status(204).send();
}

export const projectControllers = {
   getProjects,
   createProject,
   updateProject,
   deleteProject,
   getProjectUsers,
   postProjectUsers,
   deleteProjectUsers,
};
