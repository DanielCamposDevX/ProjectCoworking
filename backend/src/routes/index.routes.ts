import { Router } from 'express';
import permissionRouter from './permissions.routes.js';
import projectRouter from './projects.routes.js';
import userRouter from './user.routes.js';

const IndexRouter = Router();
IndexRouter.use(userRouter).use(projectRouter).use(permissionRouter);

export default IndexRouter;
