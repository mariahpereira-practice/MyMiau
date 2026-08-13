"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatosService = exports.GatosService = void 0;
const catSitterAction_1 = require("../models/catSitterAction");
const tutorAction_1 = require("../models/tutorAction");
const user_model_1 = require("../models/user.model");
class GatosService {
    async __findUserOrThrow(idUser) {
        const user = await user_model_1.UserModel.findById(idUser);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        return new user_model_1.UserModel({ user });
    }
    async listGatos(filters, idUser) {
        const user = await this.__findUserOrThrow(idUser);
        if (filters.disponiveis === true) {
            const action = new catSitterAction_1.ListarGatosDisponiveisCatSitterAction(user, filters);
            return action.run();
        }
        const action = new tutorAction_1.ListarMeusGatosTutorAction(user, filters);
        return action.run();
    }
    async saveGato(data) {
        const tutor = await this.__findUserOrThrow(data.tutor_id);
        const action = new tutorAction_1.CriarGatoTutorAction(tutor, data);
        return action.run();
    }
    async updateGato(id, idTutor, data) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.AtualizarGatoTutorAction(tutor, id, data);
        return action.run();
    }
}
exports.GatosService = GatosService;
exports.gatosService = new GatosService();
//# sourceMappingURL=gatos.service.js.map