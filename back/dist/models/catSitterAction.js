"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcluirTarefa = exports.ListarTarefasCatSitterAction = exports.ListarGatosDisponiveisCatSitterAction = void 0;
const gato_model_1 = require("./gato.model");
const tarefa_model_1 = require("./tarefa.model");
const action_1 = require("./action");
class CatSitterAction extends action_1.Action {
    constructor(user) {
        super(user);
    }
}
class ListarGatosDisponiveisCatSitterAction extends CatSitterAction {
    constructor(user, filters) {
        super(user);
        this.filters = filters;
    }
    async run() {
        this.requireUserId();
        const gatos = await gato_model_1.GatoModel.findMany({
            searchGato: this.filters.searchGato,
            searchTutor: this.filters.searchTutor,
            disponiveis: true,
        });
        return gatos
            .map((gato) => new gato_model_1.GatoModel({ gato }).toResponse())
            .filter((gato) => gato !== null);
    }
}
exports.ListarGatosDisponiveisCatSitterAction = ListarGatosDisponiveisCatSitterAction;
class ListarTarefasCatSitterAction extends CatSitterAction {
    constructor(user, idGato) {
        super(user);
        this.idGato = idGato;
    }
    async run() {
        const gato = await gato_model_1.GatoModel.findGatoByIdGato(this.idGato);
        if (!gato) {
            throw new Error('Gato não encontrado.');
        }
        if (gato.disponivel_para_cuidado !== 1) {
            throw new Error('Gato não disponível para cuidado.');
        }
        const tarefas = await tarefa_model_1.TarefaModel.findMany({ idGato: this.idGato });
        return tarefas
            .map((tarefa) => new tarefa_model_1.TarefaModel({ tarefa }).toResponse())
            .filter((tarefa) => tarefa !== null);
    }
}
exports.ListarTarefasCatSitterAction = ListarTarefasCatSitterAction;
class ConcluirTarefa extends CatSitterAction {
    constructor(user, idTarefa) {
        super(user);
        this.idTarefa = idTarefa;
    }
    async run() {
        const idCatSitter = this.requireUserId();
        const tarefa = await tarefa_model_1.TarefaModel.findTarefaById(this.idTarefa);
        if (!tarefa) {
            throw new Error('Tarefa não encontrada.');
        }
        const tarefaInstance = new tarefa_model_1.TarefaModel({ tarefa });
        if (tarefaInstance.status === 'CONCLUIDA') {
            throw new Error('A tarefa já foi concluída.');
        }
        const pontos = tarefaInstance.pontos;
        const idTarefa = tarefaInstance.idTarefa;
        if (!idTarefa || !idCatSitter) {
            throw new Error('Tarefa ou usuário inválido para conclusão.');
        }
        if (pontos === null) {
            throw new Error('Tarefa inválida para atualização de pontuação.');
        }
        await tarefaInstance.updateStatusTarefa(idTarefa, idCatSitter);
        await tarefaInstance.updatePontuacaoCatSitter(idCatSitter, pontos);
    }
}
exports.ConcluirTarefa = ConcluirTarefa;
//# sourceMappingURL=catSitterAction.js.map