import { Schema, Types } from 'mongoose';
import type { TarefaStatus } from '../../../dtos/tarefa.dto';

// Subdocumento embutido em Gatos: nao existe colecao propria de tarefas.
// gato_id nao e armazenado aqui, vem do documento pai.
export interface TarefaSubdocument {
  _id: Types.ObjectId;
  descricao: string;
  pontos: number;
  status: TarefaStatus;
  concluida_por: Types.ObjectId | null;
  concluida_em: Date | null;
}

export const tarefaSchema = new Schema<TarefaSubdocument>(
  {
    descricao: { type: String, required: true },
    pontos: { type: Number, required: true },
    status: { type: String, required: true, enum: ['PENDENTE', 'CONCLUIDA'] },
    concluida_por: { type: Schema.Types.ObjectId, default: null },
    concluida_em: { type: Date, default: null },
  },
  { versionKey: false },
);
