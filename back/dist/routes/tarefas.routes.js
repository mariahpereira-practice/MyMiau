"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tarefas_controller_1 = require("../controllers/tarefas.controller");
const router = express_1.default.Router();
router.get('/', tarefas_controller_1.getListaTarefas);
router.post('/', tarefas_controller_1.postListaTarefas);
router.post('/:idLista', tarefas_controller_1.postTarefa);
router.put('/:idLista/:idTarefa', tarefas_controller_1.updateTarefa);
exports.default = router;
//# sourceMappingURL=tarefas.routes.js.map