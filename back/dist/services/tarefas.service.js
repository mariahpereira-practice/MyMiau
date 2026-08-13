"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarefasService = exports.TarefaService = void 0;
const catSitterAction_1 = require("../models/catSitterAction");
const tutorAction_1 = require("../models/tutorAction");
const user_model_1 = require("../models/user.model");
class TarefaService {
    async __findUserOrThrow(idUser) {
        const user = await user_model_1.UserModel.findById(idUser);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        return new user_model_1.UserModel({ user });
    }
    async listTarefasCatSitter({ idGato, idCatSitter }) {
        const catSitter = await this.__findUserOrThrow(idCatSitter);
        const action = new catSitterAction_1.ListarTarefasCatSitterAction(catSitter, idGato);
        return action.run();
    }
    async listTarefasTutor({ idGato, idTutor }) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.ListarTarefasTutorAction(tutor, idGato);
        return action.run();
    }
    async criarTarefa(idGato, idTutor, data) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.CriarTarefaTutorAction(tutor, idGato, data);
        await action.run();
    }
    async deletarTarefaServico(idGato, idTarefa, idTutor) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.DeletarTarefaTutorAction(tutor, idGato, idTarefa);
        await action.run();
    }
    async atualizarTarefa(idGato, idTutor, data, idTarefa) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.AtualizarTarefaTutorAction(tutor, idGato, idTarefa, data);
        await action.run();
    }
    async atualizarStatusTarefa(idTarefa, idCatSitter) {
        const catSitter = await this.__findUserOrThrow(idCatSitter);
        const concluirTarefaAction = new catSitterAction_1.ConcluirTarefa(catSitter, idTarefa);
        await concluirTarefaAction.run();
    }
}
exports.TarefaService = TarefaService;
exports.tarefasService = new TarefaService();
//# sourceMappingURL=tarefas.service.js.map