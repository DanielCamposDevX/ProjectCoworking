import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { paramsType } from 'types/params-type.js';
import { errors } from '../errors/errors.js';
import { userRepositories } from '../repositories/user-repositories.js';
import { createUserData, loginUserData } from '../types/user-types.js';

async function createUser(userData: createUserData) {
   const exists = await userRepositories.findUserByEmail(userData.email);
   if (exists) {
      throw errors.conflict('Já existe um usuário com esse email cadastrado');
   }
   const hashPass = bcrypt.hashSync(userData.senha, 10);
   userData = { ...userData, senha: hashPass };
   const create = await userRepositories.createUser(userData);
   return create;
}

async function loginUser(userData: loginUserData) {
   const user = await userRepositories.findUserByEmail(userData.email);
   if (!user) {
      throw errors.notFound('Email não cadastrado!');
   }
   if (!bcrypt.compareSync(userData.senha, user.senha)) {
      throw errors.unauthorized('Senha inválida!');
   }
   const session = await userRepositories.createSession(user.id);
   const token = jwt.sign(
      { token: session.token, id: user.id },
      process.env.JWT_KEY,
      { expiresIn: '1d' },
   );
   return token;
}

async function getAuthUser(token: string, userId: number) {
   const session = await userRepositories.findSession(token, userId);
   if (!session || session.token !== token) {
      throw errors.unauthorized('Token inválido! Faça login novamente.');
   }
   const user = await userRepositories.findUserById(userId);
   delete user.senha;
   return user;
}

async function getUsers(params: paramsType) {
   const users = await userRepositories.getUsers(params);
   return users;
}

export const userServices = { createUser, loginUser, getAuthUser, getUsers };
