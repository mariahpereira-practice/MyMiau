"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatoModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class GatoModel {
    constructor(data) {
        this.gatoRow = data.gato;
    }
    get id() {
        return this.gatoRow?.id || null;
    }
    get nomeGato() {
        return this.gatoRow?.nomeGato || null;
    }
    get idadeGato() {
        return this.gatoRow?.idadeGato || null;
    }
    get pesoGato() {
        return this.gatoRow?.pesoGato || null;
    }
    get peloGato() {
        return this.gatoRow?.peloGato || null;
    }
    get racaGato() {
        return this.gatoRow?.racaGato || null;
    }
    get idIcone() {
        return this.gatoRow?.idIcone || null;
    }
    get tutorId() {
        return this.gatoRow?.tutor_id || null;
    }
    get tutorNome() {
        return this.gatoRow?.tutorNome || null;
    }
    get disponivelParaCuidado() {
        return this.gatoRow?.disponivel_para_cuidado ?? null;
    }
    toResponse() {
        if (!this.gatoRow) {
            return null;
        }
        if (this.id === null
            || this.nomeGato === null
            || this.idadeGato === null
            || this.pesoGato === null
            || this.peloGato === null
            || this.racaGato === null
            || this.idIcone === null
            || this.tutorId === null) {
            return null;
        }
        return {
            id: this.id,
            nomeGato: this.nomeGato,
            idadeGato: this.idadeGato,
            pesoGato: this.pesoGato,
            peloGato: this.peloGato,
            racaGato: this.racaGato,
            idIcone: this.idIcone,
            tutor_id: this.tutorId,
            tutorNome: this.tutorNome ?? '',
            disponivel_para_cuidado: this.disponivelParaCuidado ?? 1,
        };
    }
    static normalizeGato(row) {
        if (!row) {
            return null;
        }
        return {
            ...row,
            id: row.id !== undefined ? Number(row.id) : row.id,
            nomeGato: row.nomeGato,
            idadeGato: row.idadeGato,
            pesoGato: row.pesoGato,
            peloGato: Number(row.peloGato),
            racaGato: row.racaGato,
            idIcone: row.idIcone,
            tutor_id: row.tutor_id,
            tutorNome: row.tutorNome,
            disponivel_para_cuidado: row.disponivel_para_cuidado ?? 1,
        };
    }
    static async findMany(filters = {}) {
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
        const rows = await database_1.default.query(sql, params);
        return rows.map((row) => GatoModel.normalizeGato(row));
    }
    static async findGatoByIdGato(id) {
        const rows = await database_1.default.query(`SELECT g.*, COALESCE(u.username, '') AS tutorNome
      FROM gatos g
      LEFT JOIN users u ON u.id = g.tutor_id
      WHERE g.id = ?
      LIMIT 1`, [id]);
        return GatoModel.normalizeGato(rows[0] || null);
    }
    static async createGato(data) {
        const result = await database_1.default.query('INSERT INTO gatos (nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.nomeGato, data.idadeGato, data.pesoGato, data.peloGato, data.racaGato, data.idIcone, data.tutor_id]);
        const newGatoId = Number(result.insertId);
        const newGato = await GatoModel.findGatoByIdGato(newGatoId);
        if (!newGato) {
            throw new Error('Failed to create gato.');
        }
        return newGato;
    }
}
exports.GatoModel = GatoModel;
//# sourceMappingURL=gato.model.js.map