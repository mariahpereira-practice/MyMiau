"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const tsoa_1 = require("tsoa");
const validate_body_middleware_1 = require("../validators/validate-body.middleware");
const dto_validators_1 = require("../validators/dto.validators");
let AuthController = class AuthController extends tsoa_1.Controller {
    constructor(service = auth_service_1.authService) {
        super();
        this.service = service;
    }
    async handlerRegister(req, res, next) {
        try {
            const result = await this.register(req.body);
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async handlerLogin(req, res, next) {
        try {
            const result = await this.login(req.body);
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async login(input) {
        const { user, token, role } = await this.service.loginUser(input);
        return { jwt: token, user, role };
    }
    async register(input) {
        const { user, token, role } = await this.service.registerUser(input);
        return { jwt: token, user, role };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)('/login'),
    (0, tsoa_1.Middlewares)((0, validate_body_middleware_1.validateBody)(dto_validators_1.validateLoginUser)),
    (0, tsoa_1.SuccessResponse)('200', 'Login realizado com sucesso'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)('/register'),
    (0, tsoa_1.Middlewares)((0, validate_body_middleware_1.validateBody)(dto_validators_1.validateRegisterUser)),
    (0, tsoa_1.SuccessResponse)('200', 'Usuário registrado com sucesso'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map