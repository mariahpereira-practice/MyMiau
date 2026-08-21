"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const user_dto_1 = require("../dtos/user.dto");
class UserModel {
    constructor(data) {
        this.__userRow = data.user;
    }
    get id() {
        return this.__userRow?.id || null;
    }
    get username() {
        return this.__userRow?.username || null;
    }
    get email() {
        return this.__userRow?.email || null;
    }
    get role() {
        return this.__userRow?.role || null;
    }
    get pontuacao() {
        return this.__userRow?.pontuacao || null;
    }
    get rankGlobal() {
        return this.__userRow?.rankGlobal || null;
    }
    get passwordHash() {
        return this.__userRow?.password_hash || null;
    }
    toProfileResponse() {
        if (!this.__userRow) {
            return null;
        }
        const profile = {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role ?? user_dto_1.UserRole.TUTOR,
        };
        if (this.pontuacao !== null) {
            profile.pontuacao = this.pontuacao;
        }
        if (this.rankGlobal !== null) {
            profile.rankGlobal = this.rankGlobal;
        }
        return profile;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map