"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    constructor(user) {
        this.user = user;
    }
    requireUserId() {
        const userId = this.user?.id;
        if (!userId) {
            throw new Error('Usuário inválido para esta ação.');
        }
        return userId;
    }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map