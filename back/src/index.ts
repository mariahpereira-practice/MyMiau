import db from './config/database';
import app from './app';

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


  export default app;