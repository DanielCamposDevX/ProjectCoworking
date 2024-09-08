import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ObjectSchema } from 'joi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validate(schema: ObjectSchema, type: 'body' | 'params') {
   return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, {
         abortEarly: false,
      });

      if (!error) {
         next();
      } else {
         let errorMessage = '';
         error.details.forEach((d) => (errorMessage += d.message + ' '));
         return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(errorMessage);
      }
   };
}
