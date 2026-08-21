"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const request_logger_middleware_1 = require("./middlewares/request-logger.middleware");
const routes_1 = require("./build/routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express_1.default.json());
app.use(request_logger_middleware_1.requestLogger);
const tsoaRouter = express_1.default.Router();
(0, routes_1.RegisterRoutes)(tsoaRouter);
app.use('/api', tsoaRouter);
app.use(error_middleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map