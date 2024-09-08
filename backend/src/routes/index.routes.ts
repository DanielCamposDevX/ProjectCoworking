import { Router } from 'express';
import projectRouter from './projects.routes.js';
import userRouter from './user.routes.js';

const IndexRouter = Router();
IndexRouter.use(userRouter).use(projectRouter);

export default IndexRouter;
