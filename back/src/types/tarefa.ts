export interface Tarefa {
  idTarefa: number;
  gato_id: number;
  descricao: string;
  pontos: number;
  status: 'PENDENTE' | 'CONCLUIDA';
  concluida_por?: number | null;
  concluida_em?: Date | null;
}