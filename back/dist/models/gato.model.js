"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMany = findMany;
const database_1 = __importDefault(require("../config/database"));
function normalizeGato(row) {
    if (!row) {
        return null;
    }
    return {
        ...row,
        id: row.id !== undefined ? Number(row.id) : row.id,
        nomeGato: row.nomeGato,
        nomeTutor: row.nomeTutor,
    };
}
async function findMany({ id, search, } = {}) {
    const where = [];
    const params = [];
    if (id !== undefined && id !== null && String(id).trim() !== '') {
        where.push('id = ?');
        params.push(Number(id));
    }
    if (search && String(search).trim() !== '') {
        where.push('(LOWER(nomeGato) LIKE LOWER(?) OR LOWER(nomeTutor) LIKE LOWER(?))');
        const searchTerm = `%${String(search).trim()}%`;
        params.push(searchTerm, searchTerm);
    }
    const sql = `SELECT * FROM gatos${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC`;
    const rows = await database_1.default.query(sql, params);
    return rows.map((row) => normalizeGato(row));
}
//# sourceMappingURL=gato.model.js.map