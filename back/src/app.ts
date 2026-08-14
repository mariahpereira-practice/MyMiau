import cors from 'cors';
import express from 'express';
import gatoRoutes from './routes/gato.routes';
import errorHandler from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import tarefaRoutes from './routes/tarefas.routes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gatos', gatoRoutes);
app.use('/api/tarefas', tarefaRoutes);

app.use(errorHandler);

export default app;
