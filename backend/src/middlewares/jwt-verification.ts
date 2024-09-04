import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config'
import httpStatus from "http-status";

export interface customRequest extends Request {
    id?: string
    token?: string
}

export async function authUser(req: customRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) return res.status(httpStatus.UNAUTHORIZED).send("Token Inválido JWT");
        req.id = (decoded as JwtPayload).id;
        req.token = (decoded as JwtPayload).token;
        next()
    })
}