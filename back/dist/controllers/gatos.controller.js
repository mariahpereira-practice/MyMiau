"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGatos = exports.saveGato = void 0;
const gatos_service_1 = require("../services/gatos.service");
function registerGato(data) {
    // Implement the logic to save the gato data to the database
    // For example, you can call a service function that handles the database operation
    // Example: await gatoService.saveGato(data);
}
const saveGato = (req, res) => {
    const data = req.body;
    registerGato(data);
    res.status(201).json({ message: 'Gato registrado com sucesso!' });
};
exports.saveGato = saveGato;
const getGatos = async (req, res, next) => {
    try {
        const { id, search } = req.query;
        const gatos = await (0, gatos_service_1.listGatos)({ id, search });
        return res.json({ gatos });
    }
    catch (error) {
        next(error);
    }
};
exports.getGatos = getGatos;
//# sourceMappingURL=gatos.controller.js.map