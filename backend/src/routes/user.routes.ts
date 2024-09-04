import { Router } from "express";
import { userControllers } from "../controllers/user-controller";
import { validate } from "../middlewares/schema-validation";
import { userSchema } from "../schemas/user-schema";

const userRouter = Router();

userRouter
    .post("/api/auth/register", validate(userSchema, "body"), userControllers.createUser)




export default userRouter;