import { Router } from 'express';
import { permissionControllers } from '../controllers/permission-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { validate } from '../middlewares/schema-validation.js';
import { permissionSchema } from '../schemas/permission-schema.js';

const permissionRouter = Router();

permissionRouter.put(
   '/api/permissions/:projectId/:userId',
   authUser,
   validate(permissionSchema),
   permissionControllers.updatePermission,
);

export default permissionRouter;
