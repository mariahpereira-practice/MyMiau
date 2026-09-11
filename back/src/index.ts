import { connectDatabase } from './config/database';
import app from './app';

const PORT = Number(process.env.PORT);

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((err: unknown) => {
  console.error('Unable to connect to DB', err);
  process.exit(1);
});

  export default app;