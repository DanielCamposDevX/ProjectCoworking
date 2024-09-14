import { Router } from 'express';
import commentRouter from './comment.router.js';
import permissionRouter from './permissions.routes.js';
import projectRouter from './projects.routes.js';
import userRouter from './user.routes.js';

const IndexRouter = Router();
IndexRouter.use(userRouter)
   .use(projectRouter)
   .use(permissionRouter)
   .use(commentRouter);

export default IndexRouter;
