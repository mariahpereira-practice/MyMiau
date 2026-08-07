"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(status).json({
        statusCode: status,
        message,
        error: true,
        ...(err.code ? { code: err.code } : {}),
        ...(err.errno ? { errno: err.errno } : {}),
        ...(err.sqlState ? { sqlState: err.sqlState } : {}),
    });
}
//# sourceMappingURL=error.middleware.js.map