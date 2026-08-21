"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_body_middleware_1 = require("../validators/validate-body.middleware");
const dto_validators_1 = require("../validators/dto.validators");
const tarefas_controller_1 = require("../controllers/tarefas.controller");
const router = express_1.default.Router();
router.post('/tarefa/:idGato', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateCreateTarefa), tarefas_controller_1.tarefaController.handlerPostTarefa.bind(tarefas_controller_1.tarefaController));
router.get('/:idGato', auth_middleware_1.requiredAuth, tarefas_controller_1.tarefaController.handlerGetListaTarefas.bind(tarefas_controller_1.tarefaController));
router.delete('/tarefa/:idGato/:idTarefa', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), tarefas_controller_1.tarefaController.handlerDeleteTarefa.bind(tarefas_controller_1.tarefaController));
router.put('/tarefa/:idGato/:idTarefa', auth_middleware_1.requiredAuth, (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateUpdateTarefa), tarefas_controller_1.tarefaController.handlerUpdateTarefa.bind(tarefas_controller_1.tarefaController));
exports.default = router;
//# sourceMappingURL=tarefas.routes.js.map