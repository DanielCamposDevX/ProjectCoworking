import { Response } from "express";
import { userServices } from "services/user/user-services";
import { customRequest } from "../middlewares/jwt-verification";
import { createUserData } from "../types/user-types";



async function createUser(req: customRequest, res: Response): Promise<void> {
  const userdata = req.body as createUserData;
  const user = await userServices.createUser(userdata);
  res.status(201).json({ id: user.id, email: user.email, nome: user.nome, papel: user.papel  });
}



export const userControllers = { createUser };