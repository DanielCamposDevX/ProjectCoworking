import { Router } from 'express';
import { userControllers } from '../controllers/user-controller.js';
import { authUser } from '../middlewares/jwt-verification.js';
import { queryValidations } from '../middlewares/query-validation.js';
import { validate } from '../middlewares/schema-validation.js';
import { queryParamsSchema } from '../schemas/query-schema.js';
import { loginSchema, userSchema } from '../schemas/user-schema.js';

const userRouter = Router();

userRouter
   .get(
      '/api/usuarios',
      authUser,
      queryValidations(queryParamsSchema),
      userControllers.getUsers,
   )
   .post('/api/auth/register', validate(userSchema), userControllers.createUser)
   .post('/api/auth/login', validate(loginSchema), userControllers.loginUser)
   .get('/api/auth/me', authUser, userControllers.getAuthUser);

export default userRouter;
