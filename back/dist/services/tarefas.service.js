"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTarefasCatSitter = listTarefasCatSitter;
exports.listTarefasTutor = listTarefasTutor;
exports.criarTarefa = criarTarefa;
exports.deletarTarefaServico = deletarTarefaServico;
exports.atualizarTarefa = atualizarTarefa;
exports.atualizarStatusTarefa = atualizarStatusTarefa;
const tarefa_model_1 = require("../models/tarefa.model");
const gato_model_1 = require("../models/gato.model");
async function listTarefasCatSitter({ idGato }) {
    const gato = await gato_model_1.GatoModel.findGatoByIdGato(idGato);
    if (!gato) {
        throw new Error('Gato não encontrado.');
    }
    if (gato.disponivel_para_cuidado !== 1) {
        throw new Error('Gato não disponível para cuidado.');
    }
    const tarefas = await tarefa_model_1.TarefaModel.findMany({ idGato });
    return tarefas
        .map((tarefa) => new tarefa_model_1.TarefaModel({ tarefa }).toResponse())
        .filter((tarefa) => tarefa !== null);
}
async function listTarefasTutor({ idGato, idTutor }) {
    const gato = await gato_model_1.GatoModel.findGatoByIdGato(idGato);
    if (!gato) {
        throw new Error('Gato não encontrado.');
    }
    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para visualizar as tarefas deste gato.');
    }
    const tarefas = await tarefa_model_1.TarefaModel.findMany({ idGato });
    return tarefas
        .map((tarefa) => new tarefa_model_1.TarefaModel({ tarefa }).toResponse())
        .filter((tarefa) => tarefa !== null);
}
async function criarTarefa(idGato, idTutor, data) {
    const gato = await gato_model_1.GatoModel.findGatoByIdGato(idGato);
    if (!gato) {
        throw new Error('Gato não encontrado.');
    }
    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para criar tarefas para este gato.');
    }
    if (!data.descricao?.trim()
        || data.pontos == null) {
        throw new Error('Descrição e pontos são obrigatórios para salvar uma tarefa.');
    }
    await tarefa_model_1.TarefaModel.createTarefa({
        gato_id: idGato,
        descricao: data.descricao,
        pontos: data.pontos,
        status: 'PENDENTE',
        concluida_por: idTutor,
        concluida_em: new Date(),
    });
}
async function deletarTarefaServico(idGato, idTarefa, idTutor) {
    const gato = await gato_model_1.GatoModel.findGatoByIdGato(idGato);
    if (!gato) {
        throw new Error('Gato não encontrado.');
    }
    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para deletar tarefas deste gato.');
    }
    const tarefa = await tarefa_model_1.TarefaModel.findTarefaById(idTarefa);
    if (!tarefa) {
        throw new Error('Tarefa não encontrada.');
    }
    const tarefaInstance = new tarefa_model_1.TarefaModel({ tarefa });
    if (tarefaInstance.gato_id !== idGato) {
        throw new Error('A tarefa não pertence a este gato.');
    }
    await tarefa_model_1.TarefaModel.deletarTarefa(idTarefa);
}
async function atualizarTarefa(idGato, idTutor, data, idTarefa) {
    const gato = await gato_model_1.GatoModel.findGatoByIdGato(idGato);
    if (!gato) {
        throw new Error('Gato não encontrado.');
    }
    if (gato.tutor_id !== idTutor) {
        throw new Error('Você não tem permissão para atualizar tarefas deste gato.');
    }
    const tarefa = await tarefa_model_1.TarefaModel.findTarefaById(idTarefa);
    if (!tarefa) {
        throw new Error('Tarefa não encontrada.');
    }
    const tarefaInstance = new tarefa_model_1.TarefaModel({ tarefa });
    if (tarefaInstance.gato_id !== idGato) {
        throw new Error('A tarefa não pertence a este gato.');
    }
    if (tarefaInstance.descricao === null
        || tarefaInstance.pontos === null
        || tarefaInstance.status === null) {
        throw new Error('Dados da tarefa inválidos para atualização.');
    }
    const payload = {
        descricao: data.descricao ?? tarefaInstance.descricao,
        pontos: data.pontos ?? tarefaInstance.pontos,
        status: data.status ?? tarefaInstance.status,
    };
    await tarefa_model_1.TarefaModel.updateTarefa(payload, idTarefa);
}
async function atualizarStatusTarefa(idTarefa, idCatSitter) {
    const tarefa = await tarefa_model_1.TarefaModel.findTarefaById(idTarefa);
    if (!tarefa) {
        throw new Error('Tarefa não encontrada.');
    }
    const tarefaInstance = new tarefa_model_1.TarefaModel({ tarefa });
    if (tarefaInstance.status === 'CONCLUIDA') {
        throw new Error('A tarefa já foi concluída.');
    }
    if (tarefaInstance.pontos === null) {
        throw new Error('Tarefa inválida para atualização de pontuação.');
    }
    await tarefa_model_1.TarefaModel.updateStatusTarefa(idTarefa, idCatSitter);
    await tarefa_model_1.TarefaModel.updatePontuacaoCatSitter(idCatSitter, tarefaInstance.pontos);
}
//# sourceMappingURL=tarefas.service.js.map