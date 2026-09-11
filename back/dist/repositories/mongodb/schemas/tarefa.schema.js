"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarefaSchema = void 0;
const mongoose_1 = require("mongoose");
exports.tarefaSchema = new mongoose_1.Schema({
    descricao: { type: String, required: true },
    pontos: { type: Number, required: true },
    status: { type: String, required: true, enum: ['PENDENTE', 'CONCLUIDA'] },
    concluida_por: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    concluida_em: { type: Date, default: null },
}, { versionKey: false });
//# sourceMappingURL=tarefa.schema.js.map