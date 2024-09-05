import { Request, Response } from "express";
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



export const userControllers = { createUser, loginUser };