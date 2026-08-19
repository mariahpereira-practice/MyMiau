import { NextFunction, Request, Response } from 'express';
import { GatosService, gatosService } from '../services/gatos.service';
import {
  GatoCreateInputDTO,
  GatoCreateRequestDTO,
  GatoResponseDTO,
  GatoUpdateInputDTO,
} from '../dtos/gato.dto';

export class GatoController {
  private readonly gatoService: GatosService;

  constructor() {
    this.gatoService = gatosService;
  }

  saveGato = async (
    req: Request<{}, {}, GatoCreateRequestDTO>, 
    res: Response, next: NextFunction): 
    Promise<Response | void> => { 
    try {
      const data = req.body;
      const idTutor = req.user?.id;
      if (!idTutor) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      const payload: GatoCreateInputDTO = {
        ...data,
        tutor_id: idTutor,
      };
      const gato = await this.gatoService.saveGato(payload);
      return res.status(201).json(gato);
    } catch (error) {
      next(error);
    }
  };

  updateGato = async (
    req: Request<{ id: string }, {}, GatoUpdateInputDTO>, 
    res: Response, next: NextFunction): 
    Promise<Response | void> => {
    try {
      const { id } = req.params;
    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const data = req.body;
    const gatoUpdated = await gatosService.updateGato(Number(id), idTutor, data);
    return res.json(gatoUpdated);
  } catch (error) {
    next(error);
  }
  };

  getGatosDisponiveis = async (
    req: Request, 
    res: Response<GatoResponseDTO[]>, 
    next: NextFunction): 
    Promise<Response | void> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json([]);
    }

    const { search, searchGato, searchTutor } = req.query;
    const gatos = await gatosService.listGatos({
      searchGato: searchGato ?? search,
      searchTutor,
      disponiveis: true,
    }, req.user.id);
    return res.json(gatos);
  } catch (error) {
    next(error);
  }
  };

  getMeusGatos = async (
    req: Request, 
    res: Response<GatoResponseDTO[]>,
    next: NextFunction): 
    Promise<Response | void> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json([]);
    }

    const { search, searchGato, searchTutor } = req.query;
    const meusGatos = await gatosService.listGatos({
      searchGato: searchGato ?? search,
      searchTutor,
    }, req.user.id);
    return res.json(meusGatos);
  } catch (error) {
    next(error);
  }

}};
