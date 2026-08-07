"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeusGatos = exports.getGatosDisponiveis = exports.updateGatoController = exports.saveGatoController = void 0;
const gatos_service_1 = require("../services/gatos.service");
const saveGatoController = async (req, res, next) => {
    try {
        const data = req.body;
        const idTutor = req.user?.id;
        if (!idTutor) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const payload = {
            ...data,
            tutor_id: idTutor,
        };
        const gato = await (0, gatos_service_1.saveGato)(payload);
        return res.status(201).json(gato);
    }
    catch (error) {
        next(error);
    }
};
exports.saveGatoController = saveGatoController;
const updateGatoController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idTutor = req.user?.id;
        if (!idTutor) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const data = req.body;
        const gatoUpdated = await (0, gatos_service_1.updateGato)(Number(id), idTutor, data);
        return res.json(gatoUpdated);
    }
    catch (error) {
        next(error);
    }
};
exports.updateGatoController = updateGatoController;
const getGatosDisponiveis = async (req, res, next) => {
    try {
        const { search, searchGato, searchTutor } = req.query;
        const gatos = await (0, gatos_service_1.listGatos)({
            searchGato: searchGato ?? search,
            searchTutor,
            disponiveis: true,
        });
        return res.json(gatos);
    }
    catch (error) {
        next(error);
    }
};
exports.getGatosDisponiveis = getGatosDisponiveis;
const getMeusGatos = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json([]);
        }
        const { search, searchGato, searchTutor } = req.query;
        const meusGatos = await (0, gatos_service_1.listGatos)({
            tutorId: req.user.id,
            searchGato: searchGato ?? search,
            searchTutor,
        });
        return res.json(meusGatos);
    }
    catch (error) {
        next(error);
    }
};
exports.getMeusGatos = getMeusGatos;
//# sourceMappingURL=gatos.controller.js.map