import { NextFunction, Request, Response } from 'express';
import { CreateTarefaInputDTO, UpdateTarefaInputDTO } from '../dtos/tarefa.dto';
import { TarefaService, tarefasService } from '../services/tarefas.service';

export class TarefaController {
  constructor(private readonly service: TarefaService = tarefasService) {}

  getListaTarefas = async (
    req: Request<{ idGato: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { idGato } = req.params;
      if (!idGato) {
        return res.status(400).json({ message: 'Parâmetro idGato inválido.' });
      }
      if (req.user?.role === 'CATSITTER') {
        const idCatSitter = req.user.id;
        const tarefas = await this.service.listTarefasCatSitter({ idGato: Number(idGato), idCatSitter });
        return res.json({ tarefas });
      }

      const idTutor = req.user?.id;
      if (!idTutor) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      const tarefas = await this.service.listTarefasTutor({ idGato: Number(idGato), idTutor });
      return res.json({ tarefas });
    } catch (error) {
      next(error);
    }
  };

  postTarefa = async (
    req: Request<{ idGato: string }, {}, CreateTarefaInputDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const idTutor = req.user?.id;
      if (!idTutor) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      await this.service.criarTarefa(Number(req.params.idGato), idTutor, req.body);
      return res.status(201).json({ message: 'Tarefa registrada com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  updateTarefa = async (
    req: Request<{ idGato: string; idTarefa: string }, {}, UpdateTarefaInputDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { idGato, idTarefa } = req.params;
      if (req.user?.role === 'CATSITTER') {
        await this.service.atualizarStatusTarefa(Number(idTarefa), req.user.id);
        return res.status(200).json({ message: 'Status da tarefa atualizado com sucesso!' });
      }

      const idTutor = req.user?.id;
      if (!idTutor) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      await this.service.atualizarTarefa(Number(idGato), idTutor, req.body, Number(idTarefa));
      return res.status(201).json({ message: 'Tarefa atualizada com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  deleteTarefa = async (
    req: Request<{ idGato: string; idTarefa: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const idTutor = req.user?.id;
      if (!idTutor) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      await this.service.deletarTarefaServico(Number(req.params.idGato), Number(req.params.idTarefa), idTutor);
      return res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
    } catch (error) {
      next(error);
    }
  };
}

export const tarefaController = new TarefaController();

