import { NextFunction, Request, Response } from 'express';
import { Tarefa } from '../types/tarefa';
import { listTarefasCatSitter, listTarefasTutor, criarTarefa, deletarTarefaServico, atualizarTarefa, atualizarStatusTarefa } from '../services/tarefas.service';

export const getListaTarefas = async (
  req: Request<{ idGato: string }>,
    res: Response, 
    next: NextFunction):
    Promise<Response | void> => {
  try {
    const { idGato } = req.params;
    if(!idGato) {
      return res.status(400).json({ message: 'Parâmetro idGato inválido.' });
    }
    if(req.user?.role === 'CATSITTER') {
      const tarefas = await listTarefasCatSitter({ idGato: Number(idGato)});
      return res.json({ tarefas });
    } else {
      const idTutor = req.user?.id;
      const tarefas = await listTarefasTutor({ idGato: Number(idGato), idTutor: Number(idTutor)});
      return res.json({ tarefas });
    }
  } catch (error) {
    next(error);
  }
};

export const postTarefa = async (
  req: Request<{ idGato: string }, {}, Tarefa>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idGato } = req.params;
    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const data: Tarefa = req.body;
    await criarTarefa(Number(idGato), Number(idTutor), data);
    res.status(201).json({ message: 'Tarefa registrada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

export const updateTarefa = async (
  req: Request<{ idGato: string; idTarefa: string }, {}, Tarefa>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idGato, idTarefa } = req.params;

    if(req.user?.role === 'CATSITTER') {
      await atualizarStatusTarefa(Number(idTarefa), Number(req.user?.id));
      return res.status(200).json({ message: 'Status da tarefa atualizado com sucesso!' });
    }

    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const data: Tarefa = req.body;
    await atualizarTarefa(Number(idGato), Number(idTutor), data, Number(idTarefa));

    res.status(201).json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

export const deleteTarefa = async (
  req: Request<{ idGato: string; idTarefa: string }>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idGato, idTarefa } = req.params;
    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    await deletarTarefaServico(Number(idGato), Number(idTarefa), Number(idTutor));
    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

