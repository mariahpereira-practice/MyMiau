"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatosService = exports.GatosService = void 0;
const catSitterAction_1 = require("../models/catSitterAction");
const tutorAction_1 = require("../models/tutorAction");
const user_model_1 = require("../models/user.model");
const repositories_1 = require("../repositories");
const repositories_2 = require("../repositories");
class GatosService {
    constructor(repository = repositories_1.userRepository, gatos = repositories_2.gatoRepository) {
        this.repository = repository;
        this.gatos = gatos;
    }
    async __findUserOrThrow(idUser) {
        const user = await this.repository.findById(idUser);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        return new user_model_1.UserModel({ user });
    }
    async listGatos(filters, idUser) {
        const user = await this.__findUserOrThrow(idUser);
        if (filters.disponiveis === true) {
            const action = new catSitterAction_1.ListarGatosDisponiveisCatSitterAction(user, filters, this.gatos);
            return action.run();
        }
        const action = new tutorAction_1.ListarMeusGatosTutorAction(user, filters, this.gatos);
        return action.run();
    }
    async saveGato(data) {
        const tutor = await this.__findUserOrThrow(data.tutor_id);
        const action = new tutorAction_1.CriarGatoTutorAction(tutor, data, this.gatos);
        return action.run();
    }
    async updateGato(id, idTutor, data) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.AtualizarGatoTutorAction(tutor, id, data, this.gatos);
        return action.run();
    }
}
exports.GatosService = GatosService;
exports.gatosService = new GatosService();
//# sourceMappingURL=gatos.service.js.map