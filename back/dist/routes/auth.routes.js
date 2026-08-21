"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validate_body_middleware_1 = require("../validators/validate-body.middleware");
const dto_validators_1 = require("../validators/dto.validators");
const router = express_1.default.Router();
router.post('/login', (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateLoginUser), auth_controller_1.authController.handlerLogin.bind(auth_controller_1.authController));
router.post('/register', (0, validate_body_middleware_1.validateBody)(dto_validators_1.validateRegisterUser), auth_controller_1.authController.handlerRegister.bind(auth_controller_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map