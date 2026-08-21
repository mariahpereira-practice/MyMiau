"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gatos_controller_1 = require("../controllers/gatos.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_body_middleware_1 = require("../validators/validate-body.middleware");
const dto_validators_1 = require("../validators/dto.validators");
const gatos_service_1 = require("../services/gatos.service");
const router = express_1.default.Router();
const gatoController = new gatos_controller_1.GatoController(gatos_service_1.gatosService);
router.get('/meus', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN), gatoController.handlerGetMeusGatos.bind(gatoController));
router.get('/disponiveis', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.CATSITTER, auth_middleware_1.UserRole.MODERATOR, auth_middleware_1.UserRole.ADMIN), gatoController.handlerGetGatosDisponiveis.bind(gatoController));
router.post('/', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateCreateGato), gatoController.handlerSaveGato.bind(gatoController));
router.put('/:id', auth_middleware_1.requiredAuth, (0, role_middleware_1.authorizeRoles)(auth_middleware_1.UserRole.TUTOR, auth_middleware_1.UserRole.ADMIN, auth_middleware_1.UserRole.MODERATOR), (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateUpdateGato), gatoController.handlerUpdateGato.bind(gatoController));
exports.default = router;
//# sourceMappingURL=gato.routes.js.map