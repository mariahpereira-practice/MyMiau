"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (validator) => (req, res, next) => {
    const errors = validator(req.body);
    if (errors.length > 0) {
        return res.status(400).json({
            error: true,
            message: 'Dados inválidos.',
            errors,
        });
    }
    return next();
};
exports.validateBody = validateBody;
//# sourceMappingURL=validate-body.middleware.js.map