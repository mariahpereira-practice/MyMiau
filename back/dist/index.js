"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const gato_routes_1 = __importDefault(require("./routes/gato.routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tarefas_routes_1 = __importDefault(require("./routes/tarefas.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/gatos', gato_routes_1.default);
app.use('/api/tarefas', tarefas_routes_1.default);
app.use(error_middleware_1.default);
const PORT = Number(process.env.PORT);
database_1.default.pool
    .getConnection()
    .then((conn) => {
    console.log('Connected to DB');
    conn.release();
    const server = app.listen(PORT, () => {
        const addr = server.address();
        const actualPort = typeof addr === 'string' ? addr : addr?.port;
        const bindAddress = typeof addr === 'string' ? addr : addr?.address || '0.0.0.0';
        const hostForLog = bindAddress === '0.0.0.0' || bindAddress === '::'
            ? process.env.HOST || 'localhost'
            : bindAddress;
        const protocol = process.env.PROTOCOL || 'http';
        console.log(`Server listening at ${protocol}://${hostForLog}:${actualPort}`);
    });
})
    .catch((err) => {
    console.error('Unable to connect to DB', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map