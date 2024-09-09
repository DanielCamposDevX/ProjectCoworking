import { Request, Response } from 'express';
import { paramsType } from 'types/params-type.js';
import { customRequest } from '../middlewares/jwt-verification.js';
import { userServices } from '../services/user-services.js';
import { createUserData, loginUserData } from '../types/user-types.js';

async function createUser(req: Request, res: Response): Promise<void> {
   const userdata = req.body as createUserData;
   const user = await userServices.createUser(userdata);
   res.status(201).json({
      id: user.id,
      email: user.email,
      nome: user.nome,
      papel: user.papel,
   });
}

async function loginUser(req: Request, res: Response) {
   const userdata = req.body as loginUserData;
   const token = await userServices.loginUser(userdata);
   res.status(200).send(token);
}

async function getAuthUser(req: customRequest, res: Response) {
   const user = await userServices.getAuthUser(req.token, req.id);
   res.status(200).json(user);
}

async function getUsers(req: customRequest, res: Response) {
   await userServices.getAuthUser(req.token, req.id);
   const searchTerm = req.query.search || '';
   req.query.page = req.query.page || '1';
   req.query.limit = req.query.limit || '10';
   const params: paramsType = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: String(searchTerm),
   };

   const users = await userServices.getUsers(params);
   res.status(200).json(users);
}

export const userControllers = { createUser, loginUser, getAuthUser, getUsers };
