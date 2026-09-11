import mongoose, { Schema, Types } from 'mongoose';
import { tarefaSchema, TarefaSubdocument } from './tarefa.schema';

export interface GatoDocument {
  _id: Types.ObjectId;
  nomeGato: string;
  idadeGato: number;
  pesoGato: number;
  peloGato: number;
  racaGato: string;
  idIcone: number;
  tutor_id: Types.ObjectId;
  disponivel_para_cuidado: 0 | 1;
  tarefas: TarefaSubdocument[];
}

const gatoSchema = new Schema<GatoDocument>(
  {
    nomeGato: { type: String, required: true },
    idadeGato: { type: Number, required: true },
    pesoGato: { type: Number, required: true },
    peloGato: { type: Number, required: true },
    racaGato: { type: String, required: true },
    idIcone: { type: Number, required: true },
    tutor_id: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    disponivel_para_cuidado: { type: Number, required: true, default: 0, enum: [0, 1] },
    tarefas: { type: [tarefaSchema], default: [] },
  },
  { versionKey: false, collection: 'Gatos' },
);

gatoSchema.index({ 'tarefas._id': 1 });

export const GatoSchemaModel = mongoose.model<GatoDocument>('Gato', gatoSchema);
