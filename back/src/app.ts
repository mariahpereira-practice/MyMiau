import cors from 'cors';
import express from 'express';
import errorHandler from './middlewares/error.middleware';
import { requestLogger } from './middlewares/request-logger.middleware';
import { RegisterRoutes } from './build/routes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());
app.use(requestLogger);

const tsoaRouter = express.Router();
RegisterRoutes(tsoaRouter);
app.use('/api', tsoaRouter);

app.use(errorHandler);

export default app;
