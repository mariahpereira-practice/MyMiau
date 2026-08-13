import { NextFunction, Request, Response } from 'express';
import { CreateTarefaInputDTO, UpdateTarefaInputDTO } from '../dtos/tarefa.dto';
import { tarefasService } from '../services/tarefas.service';

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
      const idCatSitter = req.user?.id;
      if (!idCatSitter) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      const tarefas = await tarefasService.listTarefasCatSitter({ idGato: Number(idGato), idCatSitter: Number(idCatSitter)});
      return res.json({ tarefas });
    } else {
      const idTutor = req.user?.id;
      const tarefas = await tarefasService.listTarefasTutor({ idGato: Number(idGato), idTutor: Number(idTutor)});
      return res.json({ tarefas });
    }
  } catch (error) {
    next(error);
  }
};

export const postTarefa = async (
  req: Request<{ idGato: string }, {}, CreateTarefaInputDTO>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idGato } = req.params;
    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const data: CreateTarefaInputDTO = req.body;
    await tarefasService.criarTarefa(Number(idGato), Number(idTutor), data);
    res.status(201).json({ message: 'Tarefa registrada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

export const updateTarefa = async (
  req: Request<{ idGato: string; idTarefa: string }, {}, UpdateTarefaInputDTO>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idGato, idTarefa } = req.params;

    if(req.user?.role === 'CATSITTER') {
      await tarefasService.atualizarStatusTarefa(Number(idTarefa), Number(req.user?.id));
      return res.status(200).json({ message: 'Status da tarefa atualizado com sucesso!' });
    }

    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const data: UpdateTarefaInputDTO = req.body;
    await tarefasService.atualizarTarefa(Number(idGato), Number(idTutor), data, Number(idTarefa));

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
    await tarefasService.deletarTarefaServico(Number(idGato), Number(idTarefa), Number(idTutor));
    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

