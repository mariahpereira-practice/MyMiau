"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tarefas_controller_1 = require("../controllers/tarefas.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = express_1.default.Router();
router.post('/tarefa/:idGato', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), tarefas_controller_1.postTarefa);
router.get('/:idGato', auth_middleware_1.requiredAuth, tarefas_controller_1.getListaTarefas);
router.delete('/tarefa/:idGato/:idTarefa', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), tarefas_controller_1.deleteTarefa);
router.put('/tarefa/:idGato/:idTarefa', auth_middleware_1.requiredAuth, tarefas_controller_1.updateTarefa);
exports.default = router;
//# sourceMappingURL=tarefas.routes.js.map