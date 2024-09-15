import 'dotenv/config';
import { errors } from '../errors/errors.js';
import { commentRepositories } from '../repositories/comments-repositories.js';
import { projectsRepositories } from '../repositories/projects-repositories.js';
import { userRepositories } from '../repositories/user-repositories.js';
import { commentType } from '../types/comment-type.js';
import { sendNotificationMail } from '../utils/sendMail.js';

import { logsRepositories } from '../repositories/logs-repositories.js';

import { paramsType } from '../types/query-type.js';

async function getComments(projectId: number, query?: paramsType) {
   const comments = await commentRepositories.getComments(projectId, query);
   return comments;
}

async function createComment(
   data: commentType,
   userId: number,
   projectId: number,
) {
   const project = await projectsRepositories.getProjectById(projectId);
   if (!project) {
      throw errors.notFound('Projeto não encontrado');
   }
   const user = await userRepositories.findUserById(userId);
   if (!user) {
      throw errors.notFound('Usuário não encontrado');
   }
   const comment = await commentRepositories.createComment(
      data,
      userId,
      projectId,
   );
   const message = `Comentário criado por ${user.nome}`;
   await logsRepositories.createLog(userId, projectId, message);
   await sendNotificationMail({
      projectId,
      text: message,
   });
   return comment;
}

async function updateComment(id: number, data: Partial<commentType>) {
   const comment = await commentRepositories.getCommentById(id);
   if (!comment) {
      throw errors.notFound('Comentário não encontrado');
   }
   const updatedComment = await commentRepositories.updateComment(id, data);
   const message = `${updatedComment.usuario.nome} editou um comentário em ${updatedComment.projeto.nome}`;
   await logsRepositories.createLog(
      comment.usuario.id,
      updatedComment.projeto.id,
      message,
   );
   await sendNotificationMail({
      projectId: updatedComment.projeto.id,
      text: message,
   });
   return updatedComment;
}

async function deleteComment(id: number) {
   const comment = await commentRepositories.getCommentById(id);
   if (!comment) {
      throw errors.notFound('Comentário não encontrado');
   }
   await commentRepositories.deleteComment(id);
   const message = `${comment.usuario.nome} deletou um comentário em ${comment.projeto.nome}`;
   await logsRepositories.createLog(
      comment.usuarioId,
      comment.projetoId,
      message,
   );
   await sendNotificationMail({
      projectId: comment.projetoId,
      text: message,
   });
}

async function getComment(id: number) {
   const comment = await commentRepositories.getCommentById(id);
   if (!comment) {
      throw errors.notFound('Comentário não encontrado');
   }
   return comment;
}

export const commentServices = {
   getComments,
   createComment,
   updateComment,
   deleteComment,
   getComment,
};
