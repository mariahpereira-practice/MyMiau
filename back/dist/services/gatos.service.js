"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listGatos = listGatos;
const gato_model_1 = require("../models/gato.model");
async function listGatos({ id, search, }) {
    const gatos = await (0, gato_model_1.findMany)({ id, search });
    return gatos;
}
//# sourceMappingURL=gatos.service.js.map