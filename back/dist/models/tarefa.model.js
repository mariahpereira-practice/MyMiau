"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarefaModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class TarefaModel {
    constructor(data) {
        this.__tarefaRow = data.tarefa;
    }
    get idTarefa() {
        return this.__tarefaRow?.idTarefa || null;
    }
    get gato_id() {
        return this.__tarefaRow?.gato_id || null;
    }
    get descricao() {
        return this.__tarefaRow?.descricao || null;
    }
    get pontos() {
        return this.__tarefaRow?.pontos || null;
    }
    get status() {
        return this.__tarefaRow?.status || null;
    }
    get concluida_por() {
        return this.__tarefaRow?.concluida_por || null;
    }
    get concluida_em() {
        return this.__tarefaRow?.concluida_em || null;
    }
    toResponse() {
        if (!this.__tarefaRow) {
            return null;
        }
        const response = {
            idTarefa: this.idTarefa,
            gato_id: this.gato_id,
            descricao: this.descricao,
            pontos: this.pontos,
            status: this.status,
            concluida_por: this.concluida_por ?? null,
            concluida_em: this.concluida_em ?? null,
        };
        return response;
    }
    static async findMany({ idGato }) {
        const sql = `SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC`;
        const rows = await database_1.default.query(sql, [idGato]);
        return rows;
    }
    static async findTarefaById(idTarefa) {
        const sql = `SELECT * FROM tarefas t WHERE t.idTarefa = ?`;
        const rows = await database_1.default.query(sql, [idTarefa]);
        return rows[0];
    }
    static async createTarefa(data) {
        const sql = `INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const result = await database_1.default.query(sql, [
            data.descricao,
            data.pontos,
            data.status,
            data.concluida_por,
            data.concluida_em,
            data.gato_id,
        ]);
        return result;
    }
    static async deletarTarefa(idTarefa) {
        const sql = `DELETE FROM tarefas WHERE idTarefa = ?`;
        await database_1.default.query(sql, [idTarefa]);
    }
    static async updateTarefa(data, idTarefa) {
        const sql = `UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ? `;
        await database_1.default.query(sql, [data.descricao, data.pontos, data.status, idTarefa]);
    }
    async updateStatusTarefa(idTarefa, idCatSitter) {
        const sql = `UPDATE tarefas SET status = 'CONCLUIDA', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?`;
        await database_1.default.query(sql, [new Date(), idCatSitter, idTarefa]);
    }
    async updatePontuacaoCatSitter(idCatSitter, pontos) {
        const sql = `UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?`;
        await database_1.default.query(sql, [pontos, idCatSitter]);
    }
}
exports.TarefaModel = TarefaModel;
//# sourceMappingURL=tarefa.model.js.map