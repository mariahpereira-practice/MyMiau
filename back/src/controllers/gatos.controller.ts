import { NextFunction, Request, Response } from 'express';
import { listGatos } from '../services/gatos.service';

interface GatoPayload {
    nomeGato: string;
    idadeGato: number;
    pesoGato: number;
    peloGato: string;
    racaGato: string;
    idIcone: number;
    nomeTutor: string;
    enderecoTutor: string;
    telefoneTutor: string;
}

function registerGato(data: GatoPayload): void {
    // Implement the logic to save the gato data to the database
    // For example, you can call a service function that handles the database operation
    // Example: await gatoService.saveGato(data);
}

export const saveGato = (req: Request<{}, {}, GatoPayload>, res: Response) => {
    const data = req.body;
    registerGato(data as GatoPayload);
    res.status(201).json({ message: 'Gato registrado com sucesso!' });
}

export const getGatos = async (
    req: Request, 
    res: Response, 
    next: NextFunction): 
    Promise<Response | void> => {
  try {
    const { id, search } = req.query;
    const gatos = await listGatos({ id, search });
    return res.json({ gatos });
  } catch (error) {
    next(error);
  }
};
