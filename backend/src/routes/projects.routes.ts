import { projectControllers } from 'controllers/projects-controller';
import { Router } from 'express';
import { authUser } from 'middlewares/jwt-verification';
import { validate } from 'middlewares/schema-validation';
import {
   projectSchema,
   projectUserSchema,
   updateProjectSchema,
} from 'schemas/projects-schema';

const projectRouter = Router();

projectRouter
   .get('/api/projetos', authUser, projectControllers.getProjects)
   .post(
      '/api/projetos',
      authUser,
      validate(projectSchema, 'body'),
      projectControllers.createProject,
   )
   .put(
      '/api/projetos/:id',
      authUser,
      validate(updateProjectSchema, 'body'),
      projectControllers.updateProject,
   )
   .delete('/api/projetos/:id', authUser, projectControllers.deleteProject)
   .get(
      '/api/projetos/:id/usuarios',
      authUser,
      projectControllers.getProjectUsers,
   )
   .post(
      '/api/projetos/:id/usuarios',
      authUser,
      validate(projectUserSchema, 'body'),
      projectControllers.postProjectUsers,
   )
   .delete(
      '/api/projetos/:id/usuarios/:usuario_id',
      authUser,
      projectControllers.deleteProjectUsers,
   );

export default projectRouter;
