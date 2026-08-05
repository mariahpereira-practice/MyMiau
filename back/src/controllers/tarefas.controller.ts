import { NextFunction, Request, Response } from 'express';

interface ListaTarefas{
    tarefas: Tarefa[];
}

interface Tarefa {
  descTarefa: string;
  tarefaCumprida: boolean;
}

export const getListaTarefas = async (
    req: Request,
    res: Response<ListaTarefas>, 
    next: NextFunction): 
    Promise<Response | void> => {
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
  } catch (error) {
    next(error);
  }
};

export const postListaTarefas = async (
  req: Request<{}, {}, ListaTarefas>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { tarefas } = req.body;
    // Implement the logic to save the tarefas data to the database
    // For example, you can call a service function that handles the database operation
    // Example: await tarefasService.saveTarefas(tarefas);
    res.status(201).json({ message: 'Lista de tarefas registrada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

export const postTarefa = async (
  req: Request<{ idLista: string }, {}, Tarefa>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { idLista } = req.params;
    const { descTarefa, tarefaCumprida } = req.body;
    // Implement the logic to save the tarefa data to the database for the specified idLista
    // For example, you can call a service function that handles the database operation
    // Example: await tarefasService.saveTarefa(idLista, { descTarefa, tarefaCumprida });
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
    const { descTarefa, tarefaCumprida } = req.body;
    // Implement the logic to update the tarefa data in the database for the specified idLista and idTarefa
    // For example, you can call a service function that handles the database operation
    // Example: await tarefasService.updateTarefa(idLista, idTarefa, { descTarefa, tarefaCumprida });
    res.status(201).json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    next(error);
  }
};