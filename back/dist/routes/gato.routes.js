"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gatos_controller_1 = require("../controllers/gatos.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/', gatos_controller_1.getGatos);
router.post('/', auth_middleware_1.requiredAuth, gatos_controller_1.saveGato);
exports.default = router;
//# sourceMappingURL=gato.routes.js.map