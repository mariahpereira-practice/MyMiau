import type { TarefaResponseDTO, TarefaStatus } from '../dtos/tarefa.dto';

export interface CreateTarefaRepositoryInput {
  descricao: string;
  pontos: number;
  status: TarefaStatus;
  concluida_por: string | null;
  concluida_em: Date;
  gato_id: string;
}

export interface UpdateTarefaRepositoryInput {
  descricao: string;
  pontos: number;
  status: TarefaStatus;
}

export interface TarefaRepository {
  findMany(idGato: string): Promise<TarefaResponseDTO[]>;
  findById(idTarefa: string): Promise<TarefaResponseDTO | undefined>;
  create(data: CreateTarefaRepositoryInput): Promise<{ insertId: string }>;
  delete(idTarefa: string): Promise<void>;
  update(idTarefa: string, data: UpdateTarefaRepositoryInput): Promise<void>;
  updateStatus(idTarefa: string, idCatSitter: string): Promise<void>;
  addPoints(idCatSitter: string, pontos: number): Promise<void>;
}

