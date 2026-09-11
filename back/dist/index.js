"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT);
const startServer = async () => {
    await (0, database_1.connectDatabase)();
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer().catch((err) => {
    console.error('Unable to connect to DB', err);
    process.exit(1);
});
exports.default = app_1.default;
//# sourceMappingURL=index.js.map