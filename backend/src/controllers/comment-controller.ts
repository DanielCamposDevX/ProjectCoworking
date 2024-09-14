import { Response } from 'express';
import { customRequest } from '../middlewares/jwt-verification.js';
import { commentServices } from '../services/comment-services.js';
import { userServices } from '../services/user-services.js';
import { paramsType } from '../types/query-type.js';

async function getComments(
   req: customRequest & { query: paramsType },
   res: Response,
) {
   await userServices.getAuthUser(req.token, req.id);
   const comments = await commentServices.getComments(
      Number(req.params.id),
      req.query,
   );
   res.status(200).json(comments);
}

async function createComment(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const comment = await commentServices.createComment(
      req.body,
      req.id,
      Number(req.params.id),
   );
   res.status(201).json(comment);
}

async function updateComment(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const comment = await commentServices.updateComment(
      Number(req.params.id),
      req.body,
   );
   res.status(200).json(comment);
}

async function deleteComment(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   await commentServices.deleteComment(Number(req.params.id));
   res.status(204).send();
}

async function getComment(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const comment = await commentServices.getComment(Number(req.params.id));
   res.status(200).json(comment);
}

export const commentControllers = {
   getComments,
   createComment,
   updateComment,
   deleteComment,
   getComment,
};
