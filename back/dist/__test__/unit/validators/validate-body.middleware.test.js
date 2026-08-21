"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const validate_body_middleware_1 = require("../../../validators/validate-body.middleware");
const makeResponse = () => {
    const response = {
        status: globals_1.jest.fn(),
        json: globals_1.jest.fn(),
    };
    response.status.mockReturnValue(response);
    return response;
};
(0, globals_1.describe)('validateBody', () => {
    (0, globals_1.test)('retorna 400 e não chama next quando o body é inválido', () => {
        const response = makeResponse();
        const next = globals_1.jest.fn();
        const middleware = (0, validate_body_middleware_1.validateBody)(() => ['campo inválido.']);
        middleware({ body: {} }, response, next);
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith({
            error: true,
            message: 'Dados inválidos.',
            errors: ['campo inválido.'],
        });
        (0, globals_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, globals_1.test)('chama next quando o body é válido', () => {
        const response = makeResponse();
        const next = globals_1.jest.fn();
        const validator = globals_1.jest.fn((_body) => []);
        const middleware = (0, validate_body_middleware_1.validateBody)(validator);
        const body = { nome: 'Marley' };
        middleware({ body }, response, next);
        (0, globals_1.expect)(validator).toHaveBeenCalledWith(body);
        (0, globals_1.expect)(next).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(response.status).not.toHaveBeenCalled();
        (0, globals_1.expect)(response.json).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=validate-body.middleware.test.js.map