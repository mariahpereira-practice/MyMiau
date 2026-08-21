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
exports.tarefaController = exports.TarefaController = void 0;
const tsoa_1 = require("tsoa");
const tarefas_service_1 = require("../services/tarefas.service");
const user_dto_1 = require("../dtos/user.dto");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_body_middleware_1 = require("../validators/validate-body.middleware");
const dto_validators_1 = require("../validators/dto.validators");
let TarefaController = class TarefaController extends tsoa_1.Controller {
    constructor(service = tarefas_service_1.tarefasService) {
        super();
        this.service = service;
    }
    async handlerGetListaTarefas(req, res, next) {
        try {
            return res.json(await this.getListaTarefas(Number(req.params.idGato), req));
        }
        catch (error) {
            next(error);
        }
    }
    async handlerPostTarefa(req, res, next) {
        try {
            return res.status(201).json(await this.postTarefa(Number(req.params.idGato), req.body, req));
        }
        catch (error) {
            next(error);
        }
    }
    async handlerUpdateTarefa(req, res, next) {
        try {
            const result = await this.updateTarefa(Number(req.params.idGato), Number(req.params.idTarefa), req.body, req);
            return res.status(req.user?.role === 'CATSITTER' ? 200 : 201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async handlerDeleteTarefa(req, res, next) {
        try {
            return res.status(200).json(await this.deleteTarefa(Number(req.params.idGato), Number(req.params.idTarefa), req));
        }
        catch (error) {
            next(error);
        }
    }
    async getListaTarefas(idGato, req) {
        if (req.user?.role === 'CATSITTER') {
            return { tarefas: await this.service.listTarefasCatSitter({ idGato, idCatSitter: req.user.id }) };
        }
        const idTutor = req.user?.id;
        if (!idTutor) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        return { tarefas: await this.service.listTarefasTutor({ idGato, idTutor }) };
    }
    async postTarefa(idGato, data, req) {
        const idTutor = req.user?.id;
        if (!idTutor) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        await this.service.criarTarefa(idGato, idTutor, data);
        return { message: 'Tarefa registrada com sucesso!' };
    }
    async updateTarefa(idGato, idTarefa, data, req) {
        if (req.user?.role === 'CATSITTER') {
            await this.service.atualizarStatusTarefa(idTarefa, req.user.id);
            return { message: 'Status da tarefa atualizado com sucesso!' };
        }
        const idTutor = req.user?.id;
        if (!idTutor) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        await this.service.atualizarTarefa(idGato, idTutor, data, idTarefa);
        this.setStatus(201);
        return { message: 'Tarefa atualizada com sucesso!' };
    }
    async deleteTarefa(idGato, idTarefa, req) {
        const idTutor = req.user?.id;
        if (!idTutor) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
        await this.service.deletarTarefaServico(idGato, idTarefa, idTutor);
        return { message: 'Tarefa deletada com sucesso!' };
    }
};
exports.TarefaController = TarefaController;
__decorate([
    (0, tsoa_1.Get)('{idGato}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.SuccessResponse)('200', 'Tarefas encontradas'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TarefaController.prototype, "getListaTarefas", null);
__decorate([
    (0, tsoa_1.Post)('tarefa/{idGato}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, role_middleware_1.authorizeRoles)(user_dto_1.UserRole.TUTOR, user_dto_1.UserRole.ADMIN, user_dto_1.UserRole.MODERATOR), (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateCreateTarefa)),
    (0, tsoa_1.SuccessResponse)('201', 'Tarefa criada'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], TarefaController.prototype, "postTarefa", null);
__decorate([
    (0, tsoa_1.Put)('tarefa/{idGato}/{idTarefa}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, validate_body_middleware_1.validateBody)(dto_validators_1.validateUpdateTarefa)),
    (0, tsoa_1.SuccessResponse)('200', 'Tarefa atualizada'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], TarefaController.prototype, "updateTarefa", null);
__decorate([
    (0, tsoa_1.Delete)('tarefa/{idGato}/{idTarefa}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Middlewares)((0, role_middleware_1.authorizeRoles)(user_dto_1.UserRole.TUTOR, user_dto_1.UserRole.ADMIN, user_dto_1.UserRole.MODERATOR)),
    (0, tsoa_1.SuccessResponse)('200', 'Tarefa excluída'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TarefaController.prototype, "deleteTarefa", null);
exports.TarefaController = TarefaController = __decorate([
    (0, tsoa_1.Route)('tarefas'),
    __metadata("design:paramtypes", [tarefas_service_1.TarefaService])
], TarefaController);
exports.tarefaController = new TarefaController();
//# sourceMappingURL=tarefas.controller.js.map