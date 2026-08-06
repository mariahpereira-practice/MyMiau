import { NextFunction, Request, Response } from 'express';
import { Tarefa } from '../types/tarefa';
import { listTarefasCatSitter, listTarefasTutor, criarTarefa } from '../services/tarefas.service';

type IdGatoParams = { idGato: string };

export const getListaTarefas = async (
    req: Request<IdGatoParams>,
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
  req: Request<IdGatoParams, {}, Tarefa>,
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
  req: Request<{ idLista: string; idTarefa: string }, {}, Tarefa>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idLista, idTarefa } = req.params;
    // Implement the logic to update the tarefa data in the database for the specified idLista and idTarefa
    // For example, you can call a service function that handles the database operation
    // Example: await tarefasService.updateTarefa(idLista, idTarefa, { descTarefa, tarefaCumprida });
    res.status(201).json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

export const deleteTarefa = async (
  req: Request<{ idLista: string; idTarefa: string }>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idLista, idTarefa } = req.params;
    // Implement the logic to delete the tarefa data from the database for the specified idLista and idTarefa
    // For example, you can call a service function that handles the database operation
    // Example: await tarefasService.deleteTarefa(idLista, idTarefa);
    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    next(error);
  }
};