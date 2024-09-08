import { Router } from "express";
import { authUser } from "middlewares/jwt-verification";
import { userControllers } from "../controllers/user-controller";
import { validate } from "../middlewares/schema-validation";
import { loginSchema, userSchema } from "../schemas/user-schema";

const userRouter = Router();

userRouter
    .post("/api/auth/register", validate(userSchema, "body"), userControllers.createUser)
    .post("/api/auth/login", validate( loginSchema, "body"), userControllers.loginUser)
    .get("/api/auth/me", authUser, userControllers.getAuthUser);




export default userRouter;