"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarefaRepository = exports.MariaDbTarefaRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class MariaDbTarefaRepository {
    constructor(database = database_1.default) {
        this.database = database;
    }
    async findMany(idGato) {
        return this.database.query('SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC', [idGato]);
    }
    async findById(idTarefa) {
        const rows = await this.database.query('SELECT * FROM tarefas t WHERE t.idTarefa = ?', [idTarefa]);
        return rows[0];
    }
    async create(data) {
        return this.database.query('INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)', [data.descricao, data.pontos, data.status, data.concluida_por, data.concluida_em, data.gato_id]);
    }
    async delete(idTarefa) {
        await this.database.query('DELETE FROM tarefas WHERE idTarefa = ?', [idTarefa]);
    }
    async update(idTarefa, data) {
        await this.database.query('UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ?', [data.descricao, data.pontos, data.status, idTarefa]);
    }
    async updateStatus(idTarefa, idCatSitter) {
        await this.database.query("UPDATE tarefas SET status = 'CONCLUIDA', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?", [new Date(), idCatSitter, idTarefa]);
    }
    async addPoints(idCatSitter, pontos) {
        await this.database.query('UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?', [pontos, idCatSitter]);
    }
}
exports.MariaDbTarefaRepository = MariaDbTarefaRepository;
exports.tarefaRepository = new MariaDbTarefaRepository();
//# sourceMappingURL=tarefa.repository.js.map