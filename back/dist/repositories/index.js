"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.tarefaRepository = exports.gatoRepository = void 0;
const database_1 = require("../config/database");
const gato_repository_1 = require("./mariadb/gato.repository");
const tarefa_repository_1 = require("./mariadb/tarefa.repository");
const user_repository_1 = require("./mariadb/user.repository");
const gato_repository_2 = require("./mongodb/gato.repository");
const tarefa_repository_2 = require("./mongodb/tarefa.repository");
const user_repository_2 = require("./mongodb/user.repository");
const isMongo = database_1.DATABASE_DRIVER === 'mongodb';
exports.gatoRepository = isMongo
    ? gato_repository_2.mongoDbGatoRepository
    : gato_repository_1.mariaDbGatoRepository;
exports.tarefaRepository = isMongo
    ? tarefa_repository_2.mongoDbTarefaRepository
    : tarefa_repository_1.mariaDbTarefaRepository;
exports.userRepository = isMongo
    ? user_repository_2.mongoDbUserRepository
    : user_repository_1.mariaDbUserRepository;
//# sourceMappingURL=index.js.map