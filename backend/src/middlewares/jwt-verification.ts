import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface customRequest extends Request {
   id?: number;
   token?: string;
}

export async function authUser(
   req: customRequest,
   res: Response,
   next: NextFunction,
) {
   const token = req.headers.authorization?.replace('Bearer ', '');

   if (!token) {
      return res
         .status(httpStatus.UNAUTHORIZED)
         .send('Token não fornecido, faça login novamente!');
   }

   jwt.verify(token, process.env.JWT_KEY as string, (err, decoded) => {
      if (err) {
         if (err.name === 'TokenExpiredError') {
            return res
               .status(httpStatus.UNAUTHORIZED)
               .send('Token expirado, faça login novamente!');
         }
         return res
            .status(httpStatus.UNAUTHORIZED)
            .send('Token inválido, faça login novamente!');
      }

      req.id = (decoded as JwtPayload).id;
      req.token = (decoded as JwtPayload).token;
      next();
   });
}
