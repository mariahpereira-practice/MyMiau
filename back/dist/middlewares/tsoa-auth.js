"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const authenticator_1 = require("./authenticator");
async function expressAuthentication(request, securityName) {
    if (securityName !== 'jwt') {
        throw new Error(`Estratégia de autenticação não suportada: ${securityName}`);
    }
    return (0, authenticator_1.authenticateUser)(request);
}
//# sourceMappingURL=tsoa-auth.js.map