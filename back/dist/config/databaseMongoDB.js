"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
const connectMongoDB = async () => {
    try {
        const user = requireEnv('MONGODB_USERNAME');
        const password = requireEnv('MONGODB_PASSWORD');
        const url = requireEnv('MONGODB_URL');
        const port = requireEnv('MONGO_PORT');
        const database = requireEnv('MONGODB_DATABASE');
        const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin';
        const uri = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${url}:${port}/${database}?authSource=${authSource}`;
        await mongoose_1.default.connect(uri);
        console.log(`MongoDB ${url}:${port} conectado ao banco ${database}`);
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
exports.connectMongoDB = connectMongoDB;
//# sourceMappingURL=databaseMongoDB.js.map