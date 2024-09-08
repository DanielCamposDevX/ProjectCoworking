import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../src/config/database';

type createfakeUserData = {
   senha?: string;
   nome?: string;
   email?: string;
   papel?: string;
};

export async function createFakeUser(data: createfakeUserData) {
   return await prisma.usuario.create({
      data: {
         email: data.email ?? faker.internet.email(),
         nome: data.nome ?? faker.person.fullName(),
         senha: data.senha
            ? bcrypt.hashSync(data.senha, 10)
            : faker.internet.password(),
         papel: data.papel ?? faker.person.jobArea(),
      },
   });
}

export async function createFakeSession(userId: number) {
   const session = await prisma.session.create({
      data: {
         userId,
      },
   });
   const token = jwt.sign(
      { token: session.token, id: session.userId },
      process.env.JWT_KEY,
      { expiresIn: '1d' },
   );
   return token;
}
