export type TarefaStatus = 'PENDENTE' | 'CONCLUIDA';

export interface TarefaResponseDTO {
  idTarefa: number;
  gato_id: number;
  descricao: string;
  pontos: number;
  status: TarefaStatus;
  concluida_por?: number | null;
  concluida_em?: Date | null;
}

export interface CreateTarefaInputDTO {
  descricao: string;
  pontos: number;
}

export interface UpdateTarefaInputDTO extends Partial<CreateTarefaInputDTO> {
  descricao?: string;
  pontos?: number;
  status?: TarefaStatus;
}