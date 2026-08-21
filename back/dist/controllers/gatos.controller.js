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
exports.GatoController = void 0;
const gatos_service_1 = require("../services/gatos.service");
const tsoa_1 = require("tsoa");
const user_dto_1 = require("../dtos/user.dto");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_body_middleware_1 = require("../validators/validate-body.middleware");
const dto_validators_1 = require("../validators/dto.validators");
let GatoController = class GatoController extends tsoa_1.Controller {
    constructor(service = gatos_service_1.gatosService) {
        super();
        this._gatoService = service;
    }
    async handlerSaveGato(req, res, next) {
        try {
            const body = req.body;
            const result = await this.saveGato(body, req);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async saveGato(body, req) {
        const idTutor = req.user?.id;
        if (!idTutor) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        const payload = {
            ...body,
            tutor_id: idTutor,
        };
        return this._gatoService.saveGato(payload);
    }
    async handlerUpdateGato(req, res, next) {
        try {
            const gatoUpdated = await this.updateGato(Number(req.params.id), req.body, req);
            return res.json(gatoUpdated);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async updateGato(id, data, req) {
        const idTutor = req.user?.id;
        if (!idTutor) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        return this._gatoService.updateGato(id, idTutor, data);
    }
    async handlerGetGatosDisponiveis(req, res, next) {
        try {
            const { search, searchGato, searchTutor } = req.query;
            const gatos = await this.getGatosDisponiveis(req, search, searchGato, searchTutor);
            return res.json(gatos);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getGatosDisponiveis(req, search, searchGato, searchTutor) {
        const idUser = req.user?.id;
        if (!idUser) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        return this._gatoService.listGatos({
            searchGato: searchGato ?? search,
            searchTutor,
            disponiveis: true,
        }, idUser);
    }
    async handlerGetMeusGatos(req, res, next) {
        try {
            const { search, searchGato, searchTutor } = req.query;
            const meusGatos = await this.getMeusGatos(req, search, searchGato, searchTutor);
            return res.json(meusGatos);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getMeusGatos(req, search, searchGato, searchTutor) {
        const idUser = req.user?.id;
        if (!idUser) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        return this._gatoService.listGatos({
            searchGato: searchGato ?? search,
            searchTutor,
        }, idUser);
    }
};
exports.GatoController = GatoController;
__decorate([
    (0, tsoa_1.Post)('/'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, role_middleware_1.authorizeRoles)(user_dto_1.UserRole.TUTOR, user_dto_1.UserRole.ADMIN, user_dto_1.UserRole.MODERATOR), (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateCreateGato)),
    (0, tsoa_1.SuccessResponse)('201', 'Gato criado com sucesso'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatoController.prototype, "saveGato", null);
__decorate([
    (0, tsoa_1.Put)('{id}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, role_middleware_1.authorizeRoles)(user_dto_1.UserRole.TUTOR, user_dto_1.UserRole.ADMIN, user_dto_1.UserRole.MODERATOR), (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateUpdateGato)),
    (0, tsoa_1.SuccessResponse)('200', 'Gato atualizado com sucesso'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], GatoController.prototype, "updateGato", null);
__decorate([
    (0, tsoa_1.Get)('/disponiveis'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, role_middleware_1.authorizeRoles)(user_dto_1.UserRole.CATSITTER, user_dto_1.UserRole.MODERATOR, user_dto_1.UserRole.ADMIN)),
    (0, tsoa_1.SuccessResponse)('200', 'Gatos disponíveis encontrados'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], GatoController.prototype, "getGatosDisponiveis", null);
__decorate([
    (0, tsoa_1.Get)('/meus'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, role_middleware_1.authorizeRoles)(user_dto_1.UserRole.TUTOR, user_dto_1.UserRole.ADMIN)),
    (0, tsoa_1.SuccessResponse)('200', 'Gatos do tutor encontrados'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], GatoController.prototype, "getMeusGatos", null);
exports.GatoController = GatoController = __decorate([
    (0, tsoa_1.Route)('gatos'),
    __metadata("design:paramtypes", [gatos_service_1.GatosService])
], GatoController);
//# sourceMappingURL=gatos.controller.js.map