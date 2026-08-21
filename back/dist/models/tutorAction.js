"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarTarefaTutorAction = exports.AtualizarTarefaTutorAction = exports.CriarTarefaTutorAction = exports.ListarTarefasTutorAction = exports.AtualizarGatoTutorAction = exports.CriarGatoTutorAction = exports.ListarMeusGatosTutorAction = exports.TutorAction = void 0;
const action_1 = require("./action");
const gato_model_1 = require("./gato.model");
const tarefa_model_1 = require("./tarefa.model");
const gato_repository_1 = require("../repositories/gato.repository");
const tarefa_repository_1 = require("../repositories/tarefa.repository");
class TutorAction extends action_1.Action {
    constructor(user, gatoRepositoryDependency = gato_repository_1.gatoRepository, tarefaRepositoryDependency = tarefa_repository_1.tarefaRepository) {
        super(user);
        this.gatoRepository = gatoRepositoryDependency;
        this.tarefaRepository = tarefaRepositoryDependency;
    }
}
exports.TutorAction = TutorAction;
class ListarMeusGatosTutorAction extends TutorAction {
    constructor(user, filters, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.filters = filters;
    }
    async run() {
        const tutorId = this.requireUserId();
        const gatos = await this.gatoRepository.findMany({
            tutorId,
            searchGato: this.filters.searchGato,
            searchTutor: this.filters.searchTutor,
        });
        return gatos
            .map((gato) => new gato_model_1.GatoModel({ gato }).toResponse())
            .filter((gato) => gato !== null);
    }
}
exports.ListarMeusGatosTutorAction = ListarMeusGatosTutorAction;
class CriarGatoTutorAction extends TutorAction {
    constructor(user, data, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.data = data;
    }
    async run() {
        const tutorId = this.requireUserId();
        if (!this.data.nomeGato?.trim()
            || this.data.idadeGato == null
            || this.data.pesoGato == null
            || this.data.peloGato == null
            || !this.data.racaGato?.trim()
            || this.data.idIcone == null
            || this.data.tutor_id == null) {
            throw new Error('Todos os campos são obrigatórios para salvar um gato.');
        }
        if (this.data.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para criar gato para este tutor.');
        }
        const existingGatos = await this.gatoRepository.findMany({
            searchGato: this.data.nomeGato,
            tutorId,
        });
        if (existingGatos.length > 0) {
            throw new Error('Já existe um gato com esse nome para este tutor.');
        }
        const newGato = await this.gatoRepository.create({
            nomeGato: this.data.nomeGato,
            idadeGato: this.data.idadeGato,
            pesoGato: this.data.pesoGato,
            peloGato: this.data.peloGato,
            racaGato: this.data.racaGato,
            idIcone: this.data.idIcone,
            tutor_id: tutorId,
        });
        const gato = new gato_model_1.GatoModel({ gato: newGato });
        const gatoResponse = gato.toResponse();
        if (!gatoResponse) {
            throw new Error('Erro ao normalizar resposta do gato criado.');
        }
        return gatoResponse;
    }
}
exports.CriarGatoTutorAction = CriarGatoTutorAction;
class AtualizarGatoTutorAction extends TutorAction {
    constructor(user, idGato, data, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idGato = idGato;
        this.data = data;
    }
    async run() {
        const tutorId = this.requireUserId();
        const gatoRow = await this.gatoRepository.findById(this.idGato);
        if (!gatoRow) {
            throw new Error('Gato não encontrado.');
        }
        const gato = new gato_model_1.GatoModel({ gato: gatoRow });
        if (gato.tutorId !== tutorId) {
            throw new Error('Você não tem permissão para atualizar este gato.');
        }
        if (gato.id === null
            || gato.nomeGato === null
            || gato.idadeGato === null
            || gato.pesoGato === null
            || gato.peloGato === null
            || gato.racaGato === null
            || gato.idIcone === null
            || gato.tutorId === null) {
            throw new Error('Dados do gato inválidos para atualização.');
        }
        const disponibilidade = this.data.disponivel_para_cuidado;
        const disponivelParaCuidado = disponibilidade === true
            ? 1
            : disponibilidade === false
                ? 0
                : disponibilidade ?? gato.disponivelParaCuidado ?? 1;
        const payload = {
            nomeGato: this.data.nomeGato ?? gato.nomeGato,
            idadeGato: this.data.idadeGato ?? gato.idadeGato,
            pesoGato: this.data.pesoGato ?? gato.pesoGato,
            peloGato: this.data.peloGato ?? gato.peloGato,
            racaGato: this.data.racaGato ?? gato.racaGato,
            idIcone: this.data.idIcone ?? gato.idIcone,
            disponivel_para_cuidado: disponivelParaCuidado,
        };
        await this.gatoRepository.update(this.idGato, payload);
        const updatedRow = await this.gatoRepository.findById(this.idGato);
        if (!updatedRow) {
            throw new Error('Erro ao buscar gato atualizado.');
        }
        const gatoUpdated = new gato_model_1.GatoModel({ gato: updatedRow });
        const gatoResponse = gatoUpdated.toResponse();
        if (!gatoResponse) {
            throw new Error('Erro ao normalizar resposta do gato atualizado.');
        }
        return gatoResponse;
    }
}
exports.AtualizarGatoTutorAction = AtualizarGatoTutorAction;
class ListarTarefasTutorAction extends TutorAction {
    constructor(user, idGato, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idGato = idGato;
    }
    async run() {
        const tutorId = this.requireUserId();
        const gato = await this.gatoRepository.findById(this.idGato);
        if (!gato) {
            throw new Error('Gato não encontrado.');
        }
        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para visualizar as tarefas deste gato.');
        }
        const tarefas = await this.tarefaRepository.findMany(this.idGato);
        return tarefas
            .map((tarefa) => new tarefa_model_1.TarefaModel({ tarefa }).toResponse())
            .filter((tarefa) => tarefa !== null);
    }
}
exports.ListarTarefasTutorAction = ListarTarefasTutorAction;
class CriarTarefaTutorAction extends TutorAction {
    constructor(user, idGato, data, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idGato = idGato;
        this.data = data;
    }
    async run() {
        const tutorId = this.requireUserId();
        const gato = await this.gatoRepository.findById(this.idGato);
        if (!gato) {
            throw new Error('Gato não encontrado.');
        }
        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para criar tarefas para este gato.');
        }
        if (!this.data.descricao?.trim() || this.data.pontos == null) {
            throw new Error('Descrição e pontos são obrigatórios para salvar uma tarefa.');
        }
        await this.tarefaRepository.create({
            gato_id: this.idGato,
            descricao: this.data.descricao,
            pontos: this.data.pontos,
            status: 'PENDENTE',
            concluida_por: tutorId,
            concluida_em: new Date(),
        });
    }
}
exports.CriarTarefaTutorAction = CriarTarefaTutorAction;
class AtualizarTarefaTutorAction extends TutorAction {
    constructor(user, idGato, idTarefa, data, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idGato = idGato;
        this.idTarefa = idTarefa;
        this.data = data;
    }
    async run() {
        const tutorId = this.requireUserId();
        const gato = await this.gatoRepository.findById(this.idGato);
        if (!gato) {
            throw new Error('Gato não encontrado.');
        }
        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para atualizar tarefas deste gato.');
        }
        const tarefa = await this.tarefaRepository.findById(this.idTarefa);
        if (!tarefa) {
            throw new Error('Tarefa não encontrada.');
        }
        const tarefaInstance = new tarefa_model_1.TarefaModel({ tarefa });
        if (tarefaInstance.gato_id !== this.idGato) {
            throw new Error('A tarefa não pertence a este gato.');
        }
        if (tarefaInstance.descricao === null || tarefaInstance.pontos === null || tarefaInstance.status === null) {
            throw new Error('Dados da tarefa inválidos para atualização.');
        }
        const payload = {
            descricao: this.data.descricao ?? tarefaInstance.descricao,
            pontos: this.data.pontos ?? tarefaInstance.pontos,
            status: this.data.status ?? tarefaInstance.status,
        };
        await this.tarefaRepository.update(this.idTarefa, payload);
    }
}
exports.AtualizarTarefaTutorAction = AtualizarTarefaTutorAction;
class DeletarTarefaTutorAction extends TutorAction {
    constructor(user, idGato, idTarefa, gatoRepositoryDependency, tarefaRepositoryDependency) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idGato = idGato;
        this.idTarefa = idTarefa;
    }
    async run() {
        const tutorId = this.requireUserId();
        const gato = await this.gatoRepository.findById(this.idGato);
        if (!gato) {
            throw new Error('Gato não encontrado.');
        }
        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para deletar tarefas deste gato.');
        }
        const tarefa = await this.tarefaRepository.findById(this.idTarefa);
        if (!tarefa) {
            throw new Error('Tarefa não encontrada.');
        }
        const tarefaInstance = new tarefa_model_1.TarefaModel({ tarefa });
        if (tarefaInstance.gato_id !== this.idGato) {
            throw new Error('A tarefa não pertence a este gato.');
        }
        await this.tarefaRepository.delete(this.idTarefa);
    }
}
exports.DeletarTarefaTutorAction = DeletarTarefaTutorAction;
//# sourceMappingURL=tutorAction.js.map