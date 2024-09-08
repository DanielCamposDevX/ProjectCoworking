import { prisma } from '../config/database.js';
import { createUserData } from '../types/user-types.js';

async function findUserByEmail(email: string) {
   return await prisma.usuario.findFirst({
      where: {
         email,
      },
   });
}

async function findUserById(id: number) {
   return await prisma.usuario.findFirst({
      where: {
         id,
      },
   });
}

async function findSession(token: string, userId: number) {
   return await prisma.session.findFirst({
      where: {
         token,
         userId,
      },
   });
}

async function createUser(userData: createUserData) {
   return await prisma.usuario.create({
      data: userData,
   });
}

async function createSession(id: number) {
   const session = await prisma.session.findFirst({
      where: {
         userId: id,
      },
   });
   if (session) {
      await prisma.session.delete({
         where: {
            id: session.id,
         },
      });
   }
   return await prisma.session.create({
      data: {
         userId: id,
      },
   });
}

export const userRepositories = {
   findUserById,
   findSession,
   createUser,
   findUserByEmail,
   createSession,
};
