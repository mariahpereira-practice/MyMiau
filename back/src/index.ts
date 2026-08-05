import db from './config/database';
import cors from 'cors';
import express from 'express';
import gatoRoutes from './routes/gato.routes';
import errorHandler from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import tarefaRoutes from './routes/tarefas.routes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gatos', gatoRoutes);
app.use('/api/tarefas', tarefaRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT);

db.pool
  .getConnection()
  .then((conn: any) => {
    console.log('Connected to DB');
    conn.release();

    const server = app.listen(PORT, () => {
      const addr = server.address();
      const actualPort = typeof addr === 'string' ? addr : addr?.port;
      const bindAddress =
        typeof addr === 'string' ? addr : addr?.address || '0.0.0.0';
      const hostForLog =
        bindAddress === '0.0.0.0' || bindAddress === '::'
          ? process.env.HOST || 'localhost'
          : bindAddress;
      const protocol = process.env.PROTOCOL || 'http';

      console.log(`Server listening at ${protocol}://${hostForLog}:${actualPort}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Unable to connect to DB', err);
    process.exit(1);
  });
