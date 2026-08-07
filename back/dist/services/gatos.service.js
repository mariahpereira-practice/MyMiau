"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listGatos = listGatos;
exports.saveGato = saveGato;
exports.updateGato = updateGato;
const gato_model_1 = require("../models/gato.model");
async function listGatos({ searchGato, searchTutor, tutorId, disponiveis }) {
    const gatos = await gato_model_1.GatoModel.findMany({ searchGato, searchTutor, tutorId, disponiveis });
    return gatos
        .map((gato) => new gato_model_1.GatoModel({ gato }).toResponse())
        .filter((gato) => gato !== null);
}
async function saveGato(data) {
    if (!data.nomeGato?.trim()
        || data.idadeGato == null
        || data.pesoGato == null
        || data.peloGato == null
        || !data.racaGato?.trim()
        || data.idIcone == null
        || data.tutor_id == null) {
        throw new Error('Todos os campos são obrigatórios para salvar um gato.');
    }
    const existingGatos = await gato_model_1.GatoModel.findMany({ searchGato: data.nomeGato, tutorId: data.tutor_id });
    if (existingGatos.length > 0) {
        throw new Error('Já existe um gato com esse nome para este tutor.');
    }
    const newGato = await gato_model_1.GatoModel.createGato({
        nomeGato: data.nomeGato,
        idadeGato: data.idadeGato,
        pesoGato: data.pesoGato,
        peloGato: data.peloGato,
        racaGato: data.racaGato,
        idIcone: data.idIcone,
        tutor_id: data.tutor_id,
    });
    const gato = new gato_model_1.GatoModel({ gato: newGato });
    const gatoResponse = gato.toResponse();
    if (!gatoResponse) {
        throw new Error('Erro ao normalizar resposta do gato criado.');
    }
    return gatoResponse;
}
async function findTutorNome(tutorId) {
    const tutors = await gato_model_1.GatoModel.findMany({ tutorId });
    return tutors[0]?.tutorNome || '';
}
async function updateGato(id, idTutor, data) {
    const gatoRow = await gato_model_1.GatoModel.findGatoByIdGato(id);
    if (!gatoRow) {
        throw new Error('Gato não encontrado.');
    }
    const gato = new gato_model_1.GatoModel({ gato: gatoRow });
    if (gato.tutorId !== idTutor) {
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
    const gatoUpdatedRow = {
        id: gato.id,
        nomeGato: data.nomeGato ?? gato.nomeGato,
        idadeGato: data.idadeGato ?? gato.idadeGato,
        pesoGato: data.pesoGato ?? gato.pesoGato,
        peloGato: data.peloGato ?? gato.peloGato,
        racaGato: data.racaGato ?? gato.racaGato,
        idIcone: data.idIcone ?? gato.idIcone,
        tutor_id: gato.tutorId,
        tutorNome: await findTutorNome(gato.tutorId),
        disponivel_para_cuidado: data.disponivel_para_cuidado ?? gato.disponivelParaCuidado ?? 1,
    };
    const gatoUpdated = new gato_model_1.GatoModel({ gato: gatoUpdatedRow });
    const gatoResponse = gatoUpdated.toResponse();
    if (!gatoResponse) {
        throw new Error('Erro ao normalizar resposta do gato atualizado.');
    }
    return gatoResponse;
}
//# sourceMappingURL=gatos.service.js.map