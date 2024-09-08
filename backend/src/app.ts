import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import { connectDb, disconnectDB } from './config/database.js';
import errorHandler from './middlewares/error-handling.js';
import IndexRouter from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(IndexRouter);
app.use(errorHandler);

export async function init(): Promise<Express> {
   try {
      await connectDb();
      return app;
   } catch (err) {
      console.error('Erro ao conectar com o banco de dados:', err);
      return Promise.reject(err);
   }
}

export async function close(): Promise<void> {
   await disconnectDB();
}

export default app;
