import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export type ErrorType = {
    type: string,
    message: string | string[]
}

export default function errorHandler(error: ErrorType, req: Request, res: Response, next: NextFunction) {

    if (error.type === "unauthorized") {
        return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.type === "notfound") {
        return res.status(httpStatus.NOT_FOUND).send(error.message);
    }




    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Erro inesperado");
}