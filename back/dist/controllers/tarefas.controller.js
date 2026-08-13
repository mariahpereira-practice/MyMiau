"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTarefa = exports.updateTarefa = exports.postTarefa = exports.getListaTarefas = void 0;
const tarefas_service_1 = require("../services/tarefas.service");
const getListaTarefas = async (req, res, next) => {
    try {
        const { idGato } = req.params;
        if (!idGato) {
            return res.status(400).json({ message: 'Parâmetro idGato inválido.' });
        }
        if (req.user?.role === 'CATSITTER') {
            const idCatSitter = req.user?.id;
            if (!idCatSitter) {
                return res.status(401).json({ message: 'Usuário não autenticado.' });
            }
            const tarefas = await tarefas_service_1.tarefasService.listTarefasCatSitter({ idGato: Number(idGato), idCatSitter: Number(idCatSitter) });
            return res.json({ tarefas });
        }
        else {
            const idTutor = req.user?.id;
            const tarefas = await tarefas_service_1.tarefasService.listTarefasTutor({ idGato: Number(idGato), idTutor: Number(idTutor) });
            return res.json({ tarefas });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getListaTarefas = getListaTarefas;
const postTarefa = async (req, res, next) => {
    try {
        const { idGato } = req.params;
        const idTutor = req.user?.id;
        if (!idTutor) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const data = req.body;
        await tarefas_service_1.tarefasService.criarTarefa(Number(idGato), Number(idTutor), data);
        res.status(201).json({ message: 'Tarefa registrada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
};
exports.postTarefa = postTarefa;
const updateTarefa = async (req, res, next) => {
    try {
        const { idGato, idTarefa } = req.params;
        if (req.user?.role === 'CATSITTER') {
            await tarefas_service_1.tarefasService.atualizarStatusTarefa(Number(idTarefa), Number(req.user?.id));
            return res.status(200).json({ message: 'Status da tarefa atualizado com sucesso!' });
        }
        const idTutor = req.user?.id;
        if (!idTutor) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const data = req.body;
        await tarefas_service_1.tarefasService.atualizarTarefa(Number(idGato), Number(idTutor), data, Number(idTarefa));
        res.status(201).json({ message: 'Tarefa atualizada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTarefa = updateTarefa;
const deleteTarefa = async (req, res, next) => {
    try {
        const { idGato, idTarefa } = req.params;
        const idTutor = req.user?.id;
        if (!idTutor) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        await tarefas_service_1.tarefasService.deletarTarefaServico(Number(idGato), Number(idTarefa), Number(idTutor));
        res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTarefa = deleteTarefa;
//# sourceMappingURL=tarefas.controller.js.map