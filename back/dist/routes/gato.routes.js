"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gatos_controller_1 = require("../controllers/gatos.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = express_1.default.Router();
router.get('/meus', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN), gatos_controller_1.getMeusGatos);
router.get('/disponiveis', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.CATSITTER, auth_middleware_1.UserRole.MODERATOR, auth_middleware_1.UserRole.ADMIN), gatos_controller_1.getGatosDisponiveis);
router.post('/', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), gatos_controller_1.saveGatoController);
router.put('/:id', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), gatos_controller_1.updateGatoController);
exports.default = router;
//# sourceMappingURL=gato.routes.js.map