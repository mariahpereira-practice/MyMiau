"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatoSchemaModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tarefa_schema_1 = require("./tarefa.schema");
const gatoSchema = new mongoose_1.Schema({
    nomeGato: { type: String, required: true },
    idadeGato: { type: Number, required: true },
    pesoGato: { type: Number, required: true },
    peloGato: { type: Number, required: true },
    racaGato: { type: String, required: true },
    idIcone: { type: Number, required: true },
    tutor_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    disponivel_para_cuidado: { type: Number, required: true, default: 0, enum: [0, 1] },
    tarefas: { type: [tarefa_schema_1.tarefaSchema], default: [] },
}, { versionKey: false, collection: 'Gatos' });
gatoSchema.index({ 'tarefas._id': 1 });
exports.GatoSchemaModel = mongoose_1.default.model('Gato', gatoSchema);
//# sourceMappingURL=gato.schema.js.map