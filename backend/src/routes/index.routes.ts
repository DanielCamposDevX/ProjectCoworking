import { Router } from "express";
import userRouter from "./user.routes";


const IndexRouter = Router();
 IndexRouter
    .use(userRouter);






export default IndexRouter;