import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ObjectSchema } from 'joi';

export function queryValidations<T>(schema: ObjectSchema<T>) {
   return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.query, {
         abortEarly: false,
      });

      if (!error) {
         req.query = value;
         next();
      } else {
         let errorMessage = '';
         error.details.forEach((d) => (errorMessage += `${d.message} `));
         return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(errorMessage);
      }
   };
}
