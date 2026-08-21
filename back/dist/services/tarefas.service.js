"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarefasService = exports.TarefaService = void 0;
const catSitterAction_1 = require("../models/catSitterAction");
const tutorAction_1 = require("../models/tutorAction");
const user_model_1 = require("../models/user.model");
const user_repository_1 = require("../repositories/user.repository");
const gato_repository_1 = require("../repositories/gato.repository");
const tarefa_repository_1 = require("../repositories/tarefa.repository");
class TarefaService {
    constructor(repository = user_repository_1.userRepository, gatos = gato_repository_1.gatoRepository, tarefas = tarefa_repository_1.tarefaRepository) {
        this.repository = repository;
        this.gatos = gatos;
        this.tarefas = tarefas;
    }
    async __findUserOrThrow(idUser) {
        const user = await this.repository.findById(idUser);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        return new user_model_1.UserModel({ user });
    }
    async listTarefasCatSitter({ idGato, idCatSitter }) {
        const catSitter = await this.__findUserOrThrow(idCatSitter);
        const action = new catSitterAction_1.ListarTarefasCatSitterAction(catSitter, idGato, this.gatos, this.tarefas);
        return action.run();
    }
    async listTarefasTutor({ idGato, idTutor }) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.ListarTarefasTutorAction(tutor, idGato, this.gatos, this.tarefas);
        return action.run();
    }
    async criarTarefa(idGato, idTutor, data) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.CriarTarefaTutorAction(tutor, idGato, data, this.gatos, this.tarefas);
        await action.run();
    }
    async deletarTarefaServico(idGato, idTarefa, idTutor) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.DeletarTarefaTutorAction(tutor, idGato, idTarefa, this.gatos, this.tarefas);
        await action.run();
    }
    async atualizarTarefa(idGato, idTutor, data, idTarefa) {
        const tutor = await this.__findUserOrThrow(idTutor);
        const action = new tutorAction_1.AtualizarTarefaTutorAction(tutor, idGato, idTarefa, data, this.gatos, this.tarefas);
        await action.run();
    }
    async atualizarStatusTarefa(idTarefa, idCatSitter) {
        const catSitter = await this.__findUserOrThrow(idCatSitter);
        const concluirTarefaAction = new catSitterAction_1.ConcluirTarefa(catSitter, idTarefa, this.gatos, this.tarefas);
        await concluirTarefaAction.run();
    }
}
exports.TarefaService = TarefaService;
exports.tarefasService = new TarefaService();
//# sourceMappingURL=tarefas.service.js.map