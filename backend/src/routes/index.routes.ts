import { Router } from 'express';
import projectRouter from './projects.routes';
import userRouter from './user.routes';

const IndexRouter = Router();
IndexRouter.use(userRouter).use(projectRouter);

export default IndexRouter;
