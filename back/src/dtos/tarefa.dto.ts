export type TarefaStatus = 'PENDENTE' | 'CONCLUIDA';

export interface TarefaResponseDTO {
  idTarefa: string;
  gato_id: string;
  descricao: string;
  pontos: number;
  status: TarefaStatus;
  concluida_por?: string | null;
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