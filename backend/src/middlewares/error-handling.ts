import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export type ErrorType = {
   type: string;
   message: string | string[];
};

export default function errorHandler(
   error: ErrorType,
   req: Request,
   res: Response,
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   next: NextFunction,
) {
   if (error.type === 'conflict') {
      return res.status(httpStatus.CONFLICT).send(error.message);
   }

   if (error.type === 'unprocessableEntity') {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
   }

   if (error.type === 'unauthorized') {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
   }
   if (error.type === 'notfound') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
   }
   if (error.type === 'badRequest') {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
   }

   return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Erro inesperado');
}
