"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const startedAt = Date.now();
    res.on('finish', () => {
        console.info(JSON.stringify({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: Date.now() - startedAt,
            userId: req.user?.id ?? null,
        }));
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.middleware.js.map