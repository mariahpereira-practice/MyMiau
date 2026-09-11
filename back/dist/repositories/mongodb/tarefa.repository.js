"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbTarefaRepository = exports.MongoDBTarefaRepository = void 0;
const mongoose_1 = require("mongoose");
const gato_schema_1 = require("./schemas/gato.schema");
const user_schema_1 = require("./schemas/user.schema");
const SOMENTE_TAREFAS = { tarefas: 1 };
function toTarefaResponse(tarefa, gatoId) {
    return {
        idTarefa: tarefa._id.toString(),
        gato_id: gatoId.toString(),
        descricao: tarefa.descricao,
        pontos: tarefa.pontos,
        status: tarefa.status,
        concluida_por: tarefa.concluida_por ? tarefa.concluida_por.toString() : null,
        concluida_em: tarefa.concluida_em,
    };
}
class MongoDBTarefaRepository {
    async findMany(idGato) {
        if (!mongoose_1.Types.ObjectId.isValid(idGato)) {
            return [];
        }
        const gato = await gato_schema_1.GatoSchemaModel.findById(idGato)
            .select(SOMENTE_TAREFAS)
            .lean();
        if (!gato) {
            return [];
        }
        return [...gato.tarefas]
            .reverse()
            .map((tarefa) => toTarefaResponse(tarefa, gato._id));
    }
    async findById(idTarefa) {
        if (!mongoose_1.Types.ObjectId.isValid(idTarefa)) {
            return undefined;
        }
        const gato = await gato_schema_1.GatoSchemaModel.findOne({ 'tarefas._id': new mongoose_1.Types.ObjectId(idTarefa) })
            .select(SOMENTE_TAREFAS)
            .lean();
        const tarefa = gato?.tarefas.find((item) => item._id.toString() === idTarefa);
        return gato && tarefa ? toTarefaResponse(tarefa, gato._id) : undefined;
    }
    async create(data) {
        if (!mongoose_1.Types.ObjectId.isValid(data.gato_id)) {
            throw new Error('Gato não encontrado para criar a tarefa.');
        }
        const idTarefa = new mongoose_1.Types.ObjectId();
        const result = await gato_schema_1.GatoSchemaModel.updateOne({ _id: data.gato_id }, {
            $push: {
                tarefas: {
                    _id: idTarefa,
                    descricao: data.descricao,
                    pontos: data.pontos,
                    status: data.status,
                    concluida_por: data.concluida_por ? new mongoose_1.Types.ObjectId(data.concluida_por) : null,
                    concluida_em: data.concluida_em,
                },
            },
        });
        if (result.matchedCount === 0) {
            throw new Error('Gato não encontrado para criar a tarefa.');
        }
        return { insertId: idTarefa.toString() };
    }
    async delete(idTarefa) {
        if (!mongoose_1.Types.ObjectId.isValid(idTarefa)) {
            return;
        }
        await gato_schema_1.GatoSchemaModel.updateOne({ 'tarefas._id': new mongoose_1.Types.ObjectId(idTarefa) }, { $pull: { tarefas: { _id: new mongoose_1.Types.ObjectId(idTarefa) } } });
    }
    async update(idTarefa, data) {
        if (!mongoose_1.Types.ObjectId.isValid(idTarefa)) {
            return;
        }
        await gato_schema_1.GatoSchemaModel.updateOne({ 'tarefas._id': new mongoose_1.Types.ObjectId(idTarefa) }, {
            $set: {
                'tarefas.$.descricao': data.descricao,
                'tarefas.$.pontos': data.pontos,
                'tarefas.$.status': data.status,
            },
        });
    }
    async updateStatus(idTarefa, idCatSitter) {
        if (!mongoose_1.Types.ObjectId.isValid(idTarefa) || !mongoose_1.Types.ObjectId.isValid(idCatSitter)) {
            return;
        }
        await gato_schema_1.GatoSchemaModel.updateOne({ 'tarefas._id': new mongoose_1.Types.ObjectId(idTarefa) }, {
            $set: {
                'tarefas.$.status': 'CONCLUIDA',
                'tarefas.$.concluida_em': new Date(),
                'tarefas.$.concluida_por': new mongoose_1.Types.ObjectId(idCatSitter),
            },
        });
    }
    async addPoints(idCatSitter, pontos) {
        if (!mongoose_1.Types.ObjectId.isValid(idCatSitter)) {
            return;
        }
        await user_schema_1.UserSchemaModel.updateOne({ _id: idCatSitter }, { $inc: { pontuacao: pontos } });
    }
}
exports.MongoDBTarefaRepository = MongoDBTarefaRepository;
exports.mongoDbTarefaRepository = new MongoDBTarefaRepository();
//# sourceMappingURL=tarefa.repository.js.map