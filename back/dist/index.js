"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT);
database_1.default.pool
    .getConnection()
    .then((conn) => {
    console.log('Connected to DB');
    conn.release();
    const server = app_1.default.listen(PORT, () => {
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
exports.default = app_1.default;
//# sourceMappingURL=index.js.map