"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mariaDbTarefaRepository = exports.MariaDbTarefaRepository = void 0;
const databaseMariaDB_1 = __importDefault(require("../../config/databaseMariaDB"));
function toTarefaResponse(row) {
    return {
        ...row,
        idTarefa: String(row.idTarefa),
        gato_id: String(row.gato_id),
        concluida_por: row.concluida_por === null ? null : String(row.concluida_por),
    };
}
class MariaDbTarefaRepository {
    constructor(database = databaseMariaDB_1.default) {
        this.database = database;
    }
    async findMany(idGato) {
        const rows = await this.database.query('SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC', [Number(idGato)]);
        return rows.map(toTarefaResponse);
    }
    async findById(idTarefa) {
        const rows = await this.database.query('SELECT * FROM tarefas t WHERE t.idTarefa = ?', [Number(idTarefa)]);
        return rows[0] ? toTarefaResponse(rows[0]) : undefined;
    }
    async create(data) {
        const result = await this.database.query('INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)', [
            data.descricao,
            data.pontos,
            data.status,
            data.concluida_por === null ? null : Number(data.concluida_por),
            data.concluida_em,
            Number(data.gato_id),
        ]);
        return { insertId: String(result.insertId) };
    }
    async delete(idTarefa) {
        await this.database.query('DELETE FROM tarefas WHERE idTarefa = ?', [Number(idTarefa)]);
    }
    async update(idTarefa, data) {
        await this.database.query('UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ?', [data.descricao, data.pontos, data.status, Number(idTarefa)]);
    }
    async updateStatus(idTarefa, idCatSitter) {
        await this.database.query("UPDATE tarefas SET status = 'CONCLUIDA', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?", [new Date(), Number(idCatSitter), Number(idTarefa)]);
    }
    async addPoints(idCatSitter, pontos) {
        await this.database.query('UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?', [pontos, Number(idCatSitter)]);
    }
}
exports.MariaDbTarefaRepository = MariaDbTarefaRepository;
exports.mariaDbTarefaRepository = new MariaDbTarefaRepository();
//# sourceMappingURL=tarefa.repository.js.map