import express from "express";
import "express-async-errors"
import cors from 'cors'
import IndexRouter from "./routes/index.routes";
import errorHandler from "./middlewares/error-handling";
import { connectDb, disconnectDB } from "./config/database";
import { Express } from "express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(IndexRouter);
app.use(errorHandler);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}

export async function close(): Promise<void> {
   await disconnectDB();
}


export default app;