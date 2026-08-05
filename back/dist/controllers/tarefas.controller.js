"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTarefa = exports.postTarefa = exports.postListaTarefas = exports.getListaTarefas = void 0;
const getListaTarefas = async (req, res, next) => {
    try {
        const { idGato } = req.query;
        res.status(200).json({
            tarefas: [
                {
                    descTarefa: "Dar comida",
                    tarefaCumprida: false,
                },
                {
                    descTarefa: "Dar banho",
                    tarefaCumprida: true,
                },
            ],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getListaTarefas = getListaTarefas;
const postListaTarefas = async (req, res, next) => {
    try {
        const { tarefas } = req.body;
        // Implement the logic to save the tarefas data to the database
        // For example, you can call a service function that handles the database operation
        // Example: await tarefasService.saveTarefas(tarefas);
        res.status(201).json({ message: 'Lista de tarefas registrada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
};
exports.postListaTarefas = postListaTarefas;
const postTarefa = async (req, res, next) => {
    try {
        const { idLista } = req.params;
        const { descTarefa, tarefaCumprida } = req.body;
        // Implement the logic to save the tarefa data to the database for the specified idLista
        // For example, you can call a service function that handles the database operation
        // Example: await tarefasService.saveTarefa(idLista, { descTarefa, tarefaCumprida });
        res.status(201).json({ message: 'Tarefa registrada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
};
exports.postTarefa = postTarefa;
const updateTarefa = async (req, res, next) => {
    try {
        const { idLista, idTarefa } = req.params;
        const { descTarefa, tarefaCumprida } = req.body;
        // Implement the logic to update the tarefa data in the database for the specified idLista and idTarefa
        // For example, you can call a service function that handles the database operation
        // Example: await tarefasService.updateTarefa(idLista, idTarefa, { descTarefa, tarefaCumprida });
        res.status(201).json({ message: 'Tarefa atualizada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTarefa = updateTarefa;
//# sourceMappingURL=tarefas.controller.js.map