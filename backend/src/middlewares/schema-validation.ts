
import { NextFunction } from "express";
import { ObjectSchema } from "joi";
import { Request, Response } from "express";
import httpStatus from "http-status";

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
            return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(errorMessage)
        }
    };
}
