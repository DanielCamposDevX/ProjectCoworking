import { Router } from 'express';
import { userControllers } from '../controllers/user-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { validate } from '../middlewares/schema-validation.js';
import { loginSchema, userSchema } from '../schemas/user-schema.js';

const userRouter = Router();

userRouter
   .post(
      '/api/auth/register',
      validate(userSchema, 'body'),
      userControllers.createUser,
   )
   .post(
      '/api/auth/login',
      validate(loginSchema, 'body'),
      userControllers.loginUser,
   )
   .get('/api/auth/me', authUser, userControllers.getAuthUser);

export default userRouter;
