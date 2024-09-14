import { Router } from 'express';
import { commentControllers } from '../controllers/comment-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { queryValidations } from '../middlewares/query-validation.js';
import { validate } from '../middlewares/schema-validation.js';
import { commentSchema } from '../schemas/comment-schema.js';
import { queryParamsSchema } from '../schemas/query-schema.js';

const commentRouter = Router();

commentRouter
   .get(
      '/api/projetos/:id/comentarios',
      authUser,
      queryValidations(queryParamsSchema),
      commentControllers.getComments,
   )
   .post(
      '/api/projetos/:id/comentarios',
      authUser,
      validate(commentSchema),
      commentControllers.createComment,
   )
   .put(
      '/api/projetos/comentarios/:id',
      authUser,
      validate(commentSchema),
      commentControllers.updateComment,
   )
   .delete(
      '/api/projetos/comentarios/:id',
      authUser,
      commentControllers.deleteComment,
   );

export default commentRouter;
