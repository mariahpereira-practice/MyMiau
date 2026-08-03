require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('../routes/auth.routes');
const productRoutes = require('../routes/product.routes');
const cartRoutes = require('../routes/cart.routes');
const compradosRoutes = require('../routes/comprados.routes');
const errorHandler = require('../middlewares/error.middeware');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart-itens', cartRoutes);
app.use('/api/comprados', compradosRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 1337;

db.pool.getConnection()
    .then((conn) => {
        console.log('Connected to DB');
        conn.release();
        const server = app.listen(PORT, () => {
            const addr = server.address();
            const actualPort = typeof addr === 'string' ? addr : addr.port;
            const bindAddress = typeof addr === 'string' ? addr : (addr.address || '0.0.0.0');
            const hostForLog = (bindAddress === '0.0.0.0' || bindAddress === '::') ? (process.env.HOST || 'localhost') : bindAddress;
            const protocol = process.env.PROTOCOL || 'http';
            console.log(`Server listening at ${protocol}://${hostForLog}:${actualPort}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to DB', err);
        process.exit(1);
    });

