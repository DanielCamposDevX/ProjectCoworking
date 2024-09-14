import { Router } from 'express';
import { projectControllers } from '../controllers/projects-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { queryValidations } from '../middlewares/query-validation.js';
import { validate } from '../middlewares/schema-validation.js';
import {
   projectSchema,
   projectUserSchema,
   updateProjectSchema,
} from '../schemas/projects-schema.js';
import { queryParamsSchema } from '../schemas/query-schema.js';

const projectRouter = Router();

projectRouter
   .get(
      '/api/projetos/dashboard',
      authUser,
      queryValidations(queryParamsSchema),
      projectControllers.getDashboard,
   )
   .get(
      '/api/projetos',
      authUser,
      queryValidations(queryParamsSchema),
      projectControllers.getProjects,
   )
   .post(
      '/api/projetos',
      authUser,
      validate(projectSchema),
      projectControllers.createProject,
   )
   .put(
      '/api/projetos/:id',
      authUser,
      validate(updateProjectSchema),
      projectControllers.updateProject,
   )
   .delete('/api/projetos/:id', authUser, projectControllers.deleteProject)
   .get(
      '/api/projetos/:id/usuarios',
      authUser,
      queryValidations(queryParamsSchema),
      projectControllers.getProjectUsers,
   )
   .post(
      '/api/projetos/:id/usuarios',
      authUser,
      validate(projectUserSchema),
      projectControllers.postProjectUsers,
   )
   .delete(
      '/api/projetos/:id/usuarios/:usuario_id',
      authUser,
      projectControllers.deleteProjectUsers,
   );

export default projectRouter;
