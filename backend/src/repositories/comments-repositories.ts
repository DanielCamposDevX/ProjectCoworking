import { prisma } from '../config/database.js';

import { commentType } from '../types/comment-type.js';
import { paramsType } from '../types/query-type.js';

async function getComments(projectId: number, query?: paramsType) {
   const { page = 1, limit = 10 } = query || {};
   const skip = (page - 1) * limit;

   const total = await prisma.comment.count({
      where: {
         projetoId: projectId,
      },
   });

   const comments = await prisma.comment.findMany({
      skip,
      take: limit,
      where: {
         projetoId: projectId,
      },
      include: {
         usuario: {
            select: {
               id: true,
               nome: true,
            },
         },
         projeto: true,
      },
   });

   return { comments, total };
}

async function createComment(
   data: commentType,
   usuarioId: number,
   projetoId: number,
) {
   const comment = await prisma.comment.create({
      data: {
         texto: data.texto,
         usuarioId,
         projetoId,
         data: new Date(),
      },
   });
   return comment;
}

async function updateComment(id: number, data: Partial<commentType>) {
   const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
         texto: data.texto,
      },
      include: {
         usuario: {
            select: {
               id: true,
               nome: true,
            },
         },
         projeto: true,
      },
   });
   return updatedComment;
}

async function deleteComment(id: number) {
   await prisma.comment.delete({
      where: { id },
   });
}

async function getCommentById(id: number) {
   const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
         usuario: {
            select: {
               id: true,
               nome: true,
            },
         },
         projeto: true,
      },
   });
   return comment;
}

export const commentRepositories = {
   getComments,
   createComment,
   updateComment,
   deleteComment,
   getCommentById,
};
