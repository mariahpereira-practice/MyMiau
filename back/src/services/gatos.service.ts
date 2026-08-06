import { findMany, createGato, findGatoByIdGato } from '../models/gato.model';
import { GatoRequest, GatoResponse } from '../types/gato';

export async function listGatos({
  searchGato,
  searchTutor,
  tutorId,
  disponiveis
}: {
  searchGato?: unknown;
  searchTutor?: unknown;
  tutorId?: unknown;
  disponiveis?: boolean;
}) {
  const gatos = await findMany({ searchGato, searchTutor, tutorId, disponiveis });
  return gatos;
}

export async function saveGato(data: GatoRequest): Promise<GatoResponse> {
  if (
    !data.nomeGato?.trim()
    || data.idadeGato == null
    || data.pesoGato == null
    || data.peloGato == null
    || !data.racaGato?.trim()
    || data.idIcone == null
    || data.tutor_id == null
  ) {
    throw new Error('Todos os campos são obrigatórios para salvar um gato.');
  }

  const existingGatos = await findMany({ searchGato: data.nomeGato, tutorId: data.tutor_id });
  if (existingGatos.length > 0) {
    throw new Error('Já existe um gato com esse nome para este tutor.');
  }
  
  const newGato = await createGato({
    nomeGato: data.nomeGato,
    idadeGato: data.idadeGato,
    pesoGato: data.pesoGato,
    peloGato: data.peloGato,
    racaGato: data.racaGato,
    idIcone: data.idIcone,
    tutor_id: data.tutor_id,
  });

  const gato = {
    id: Number(newGato.insertId),
    nomeGato: data.nomeGato,
    idadeGato: data.idadeGato,
    pesoGato: data.pesoGato,
    peloGato: data.peloGato,
    racaGato: data.racaGato,
    idIcone: data.idIcone,
    tutor_id: data.tutor_id,
    tutorNome: await findTutorNome(data.tutor_id),
    disponivel_para_cuidado: 1 as const,
  };

  return gato;
}

async function findTutorNome(tutorId: number): Promise<string> {
  const tutors = await findMany({ tutorId });
  return tutors[0]?.tutorNome || '';
} 

export async function updateGato(id: number, idTutor: number, data: Partial<GatoRequest>): Promise<GatoResponse> {

  const gato = await findGatoByIdGato(id);

  if (!gato) {
    throw new Error('Gato não encontrado.');
  }

  if (gato.tutor_id !== idTutor) {
    throw new Error('Você não tem permissão para atualizar este gato.');
  }

  const gatoupdated = {
    id: gato.id,
    nomeGato: data.nomeGato ?? gato.nomeGato,
    idadeGato: data.idadeGato ?? gato.idadeGato,
    pesoGato: data.pesoGato ?? gato.pesoGato,
    peloGato: data.peloGato ?? gato.peloGato,
    racaGato: data.racaGato ?? gato.racaGato,
    idIcone: data.idIcone ?? gato.idIcone,
    tutor_id: gato.tutor_id,
    tutorNome: await findTutorNome(gato.tutor_id),
    disponivel_para_cuidado: data.disponivel_para_cuidado ?? gato.disponivel_para_cuidado,
  };

  return gatoupdated;
}
