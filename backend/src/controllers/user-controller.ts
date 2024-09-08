import { Request, Response } from "express";
import { customRequest } from "middlewares/jwt-verification";
import { userServices } from "services/user/user-services";
import { createUserData, loginUserData } from "../types/user-types";



async function createUser(req: Request, res: Response): Promise<void> {
  const userdata = req.body as createUserData;
  const user = await userServices.createUser(userdata);
  res.status(201).json({ id: user.id, email: user.email, nome: user.nome, papel: user.papel  });
}

async function loginUser(req: Request, res: Response) {
  const userdata = req.body as loginUserData;
  const token = await userServices.loginUser(userdata)
  res.status(200).send(token)
}

async function getAuthUser(req: customRequest, res: Response) {
  const user = await userServices.getAuthUser(req.token, req.id)
  res.status(200).json(user);
}



export const userControllers = { createUser, loginUser, getAuthUser };