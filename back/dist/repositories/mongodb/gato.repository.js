"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbGatoRepository = exports.MongoDBRepository = void 0;
const mongoose_1 = require("mongoose");
const gato_schema_1 = require("./schemas/gato.schema");
const user_schema_1 = require("./schemas/user.schema");
// Entrada do usuario vira regex: escapar evita injecao de padrao e ReDoS.
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function toGatoResponse(doc, tutorNome) {
    return {
        id: doc._id.toString(),
        nomeGato: doc.nomeGato,
        idadeGato: doc.idadeGato,
        pesoGato: doc.pesoGato,
        peloGato: doc.peloGato,
        racaGato: doc.racaGato,
        idIcone: doc.idIcone,
        tutor_id: doc.tutor_id.toString(),
        tutorNome,
        disponivel_para_cuidado: doc.disponivel_para_cuidado,
    };
}
class MongoDBRepository {
    // Substitui o LEFT JOIN com Users do MariaDB.
    async __resolveTutorNomes(docs) {
        const tutorIds = [...new Set(docs.map((doc) => doc.tutor_id.toString()))];
        const tutores = await user_schema_1.UserSchemaModel.find({ _id: { $in: tutorIds } })
            .select({ username: 1 })
            .lean();
        return new Map(tutores.map((tutor) => [tutor._id.toString(), tutor.username]));
    }
    async findMany(filters = {}) {
        const query = {};
        if (filters.tutorId !== undefined && filters.tutorId !== null && String(filters.tutorId).trim() !== '') {
            const tutorId = String(filters.tutorId).trim();
            if (!mongoose_1.Types.ObjectId.isValid(tutorId)) {
                return [];
            }
            query.tutor_id = new mongoose_1.Types.ObjectId(tutorId);
        }
        if (filters.disponiveis === true) {
            query.disponivel_para_cuidado = 1;
        }
        if (filters.searchGato && String(filters.searchGato).trim() !== '') {
            query.nomeGato = { $regex: escapeRegex(String(filters.searchGato).trim()), $options: 'i' };
        }
        if (filters.searchTutor && String(filters.searchTutor).trim() !== '') {
            const tutores = await user_schema_1.UserSchemaModel.find({
                username: { $regex: escapeRegex(String(filters.searchTutor).trim()), $options: 'i' },
            })
                .select({ _id: 1 })
                .lean();
            query.tutor_id = { $in: tutores.map((tutor) => tutor._id) };
        }
        const docs = await gato_schema_1.GatoSchemaModel.find(query).sort({ _id: -1 }).lean();
        const tutorNomes = await this.__resolveTutorNomes(docs);
        return docs.map((doc) => toGatoResponse(doc, tutorNomes.get(doc.tutor_id.toString()) ?? ''));
    }
    async findById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return null;
        }
        const doc = await gato_schema_1.GatoSchemaModel.findById(id).lean();
        if (!doc) {
            return null;
        }
        const tutorNomes = await this.__resolveTutorNomes([doc]);
        return toGatoResponse(doc, tutorNomes.get(doc.tutor_id.toString()) ?? '');
    }
    async create(data) {
        const created = await gato_schema_1.GatoSchemaModel.create({
            nomeGato: data.nomeGato,
            idadeGato: data.idadeGato,
            pesoGato: data.pesoGato,
            peloGato: data.peloGato,
            racaGato: data.racaGato,
            idIcone: data.idIcone,
            tutor_id: new mongoose_1.Types.ObjectId(data.tutor_id),
            disponivel_para_cuidado: 0,
            tarefas: [],
        });
        const newGato = await this.findById(created._id.toString());
        if (!newGato) {
            throw new Error('Failed to create gato.');
        }
        return newGato;
    }
    async update(id, data) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return;
        }
        await gato_schema_1.GatoSchemaModel.updateOne({ _id: id }, {
            $set: {
                nomeGato: data.nomeGato,
                idadeGato: data.idadeGato,
                pesoGato: data.pesoGato,
                peloGato: data.peloGato,
                racaGato: data.racaGato,
                idIcone: data.idIcone,
                disponivel_para_cuidado: data.disponivel_para_cuidado,
            },
        });
    }
}
exports.MongoDBRepository = MongoDBRepository;
exports.mongoDbGatoRepository = new MongoDBRepository();
//# sourceMappingURL=gato.repository.js.map