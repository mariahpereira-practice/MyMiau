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
        const gato = await gatos_service_1.gatosService.saveGato(payload);
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
        const gatoUpdated = await gatos_service_1.gatosService.updateGato(Number(id), idTutor, data);
        return res.json(gatoUpdated);
    }
    catch (error) {
        next(error);
    }
};
exports.updateGatoController = updateGatoController;
const getGatosDisponiveis = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json([]);
        }
        const { search, searchGato, searchTutor } = req.query;
        const gatos = await gatos_service_1.gatosService.listGatos({
            searchGato: searchGato ?? search,
            searchTutor,
            disponiveis: true,
        }, req.user.id);
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
        const meusGatos = await gatos_service_1.gatosService.listGatos({
            searchGato: searchGato ?? search,
            searchTutor,
        }, req.user.id);
        return res.json(meusGatos);
    }
    catch (error) {
        next(error);
    }
};
exports.getMeusGatos = getMeusGatos;
//# sourceMappingURL=gatos.controller.js.map