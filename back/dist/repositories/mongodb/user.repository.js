"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbUserRepository = exports.MongoDBUserRepository = void 0;
const mongoose_1 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
function toUserRow(doc) {
    return {
        id: doc._id.toString(),
        username: doc.username,
        email: doc.email,
        role: doc.role,
        pontuacao: doc.pontuacao,
        rankGlobal: doc.rankGlobal,
        password_hash: doc.password_hash,
    };
}
class MongoDBUserRepository {
    async findByEmail(email) {
        const doc = await user_schema_1.UserSchemaModel.findOne({ email }).lean();
        return doc ? toUserRow(doc) : null;
    }
    async findByUsername(username) {
        const doc = await user_schema_1.UserSchemaModel.findOne({ username }).lean();
        return doc ? toUserRow(doc) : null;
    }
    async findById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return null;
        }
        const doc = await user_schema_1.UserSchemaModel.findById(id).lean();
        return doc ? toUserRow(doc) : null;
    }
    async create(data) {
        const created = await user_schema_1.UserSchemaModel.create({
            username: data.username,
            email: data.email,
            password_hash: data.password_hash,
            role: data.role,
            pontuacao: 0,
            rankGlobal: '',
        });
        return { insertId: created._id.toString() };
    }
}
exports.MongoDBUserRepository = MongoDBUserRepository;
exports.mongoDbUserRepository = new MongoDBUserRepository();
//# sourceMappingURL=user.repository.js.map