import { Response } from 'express';
import { customRequest } from '../middlewares/jwt-verification.js';
import { permissionServices } from '../services/permission-services.js';
import { userServices } from '../services/user-services.js';
import { PermissionType } from '../types/permission-type.js';

async function updatePermission(
   req: customRequest,
   res: Response,
): Promise<void> {
   await userServices.getAuthUser(req.token, req.id);
   const data = req.body as PermissionType;
   const projectId = Number(req.params.projectId);
   const userId = Number(req.params.userId);
   if (!projectId || !userId) {
      res.status(422).send('Parâmetros inválidos');
   }
   const permission = await permissionServices.updateUserPermission(
      userId,
      projectId,
      data,
   );
   res.status(200).json(permission);
}

export const permissionControllers = { updatePermission };
