"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatoRepository = exports.MariaDbGatoRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class MariaDbGatoRepository {
    constructor(database = database_1.default) {
        this.database = database;
    }
    async findMany(filters = {}) {
        const where = [];
        const params = [];
        if (filters.tutorId !== undefined && filters.tutorId !== null && String(filters.tutorId).trim() !== '') {
            const parsedTutorId = Number(filters.tutorId);
            if (!Number.isNaN(parsedTutorId)) {
                where.push('g.tutor_id = ?');
                params.push(parsedTutorId);
            }
        }
        if (filters.disponiveis === true) {
            where.push('g.disponivel_para_cuidado = 1');
        }
        if (filters.searchGato && String(filters.searchGato).trim() !== '') {
            where.push('LOWER(g.nomeGato) LIKE LOWER(?)');
            params.push(`%${String(filters.searchGato).trim()}%`);
        }
        if (filters.searchTutor && String(filters.searchTutor).trim() !== '') {
            where.push('LOWER(u.username) LIKE LOWER(?)');
            params.push(`%${String(filters.searchTutor).trim()}%`);
        }
        const sql = `SELECT g.*, COALESCE(u.username, '') AS tutorNome FROM gatos g
    LEFT JOIN users u ON u.id = g.tutor_id${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC`;
        return this.database.query(sql, params);
    }
    async findById(id) {
        const rows = await this.database.query(`SELECT g.*, COALESCE(u.username, '') AS tutorNome
      FROM gatos g
      LEFT JOIN users u ON u.id = g.tutor_id
      WHERE g.id = ?
      LIMIT 1`, [id]);
        return rows[0] || null;
    }
    async create(data) {
        const result = await this.database.query('INSERT INTO gatos (nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.nomeGato, data.idadeGato, data.pesoGato, data.peloGato, data.racaGato, data.idIcone, data.tutor_id]);
        const newGato = await this.findById(Number(result.insertId));
        if (!newGato) {
            throw new Error('Failed to create gato.');
        }
        return newGato;
    }
    async update(id, data) {
        await this.database.query(`UPDATE gatos
      SET nomeGato = ?, idadeGato = ?, pesoGato = ?, peloGato = ?, racaGato = ?, idIcone = ?, disponivel_para_cuidado = ?
      WHERE id = ?`, [
            data.nomeGato,
            data.idadeGato,
            data.pesoGato,
            data.peloGato,
            data.racaGato,
            data.idIcone,
            data.disponivel_para_cuidado,
            id,
        ]);
    }
}
exports.MariaDbGatoRepository = MariaDbGatoRepository;
exports.gatoRepository = new MariaDbGatoRepository();
//# sourceMappingURL=gato.repository.js.map