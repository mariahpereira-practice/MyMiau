import { NextFunction, Request, Response } from 'express';
import { listGatos, saveGato, updateGato } from '../services/gatos.service';
import { GatoRequest, GatoResponse } from '../types/gato';

export const saveGatoController = async (
  req: Request<{}, {}, GatoRequest>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const data = req.body;
    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    data.tutor_id = idTutor;
    const gato = await saveGato(data as GatoRequest);
    return res.status(201).json(gato);
  } catch (error) {
    next(error);
  }
};

export const updateGatoController = async (
  req: Request<{ id: string }, {}, GatoRequest>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const idTutor = req.user?.id;
    if (!idTutor) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const data = req.body;
    const gatoUpdated = await updateGato(Number(id), idTutor, data as GatoRequest);
    return res.json(gatoUpdated);
  } catch (error) {
    next(error);
  }
};

export const getGatosDisponiveis = async (
    req: Request, 
    res: Response<GatoResponse[]>, 
    next: NextFunction): 
    Promise<Response | void> => {
  try {
    const { search, searchGato, searchTutor } = req.query;
    const gatos = await listGatos({
      searchGato: searchGato ?? search,
      searchTutor,
      disponiveis: true,
    });
    return res.json(gatos);
  } catch (error) {
    next(error);
  }
};

export const getMeusGatos = async (
    req: Request, 
    res: Response<GatoResponse[]>,
    next: NextFunction): 
    Promise<Response | void> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json([]);
    }

    const { search, searchGato, searchTutor } = req.query;
    const meusGatos = await listGatos({
      tutorId: req.user.id,
      searchGato: searchGato ?? search,
      searchTutor,
    });
    return res.json(meusGatos);
  } catch (error) {
    next(error);
  }
};