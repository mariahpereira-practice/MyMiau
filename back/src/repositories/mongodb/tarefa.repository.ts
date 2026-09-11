import { Types } from 'mongoose';
import type { TarefaResponseDTO } from '../../dtos/tarefa.dto';
import type {
  CreateTarefaRepositoryInput,
  TarefaRepository,
  UpdateTarefaRepositoryInput,
} from '../tarefa.repository';
import { GatoSchemaModel } from './schemas/gato.schema';
import { TarefaSubdocument } from './schemas/tarefa.schema';
import { UserSchemaModel } from './schemas/user.schema';

type GatoComTarefas = {
  _id: Types.ObjectId;
  tarefas: TarefaSubdocument[];
};

const SOMENTE_TAREFAS = { tarefas: 1 } as const;

function toTarefaResponse(tarefa: TarefaSubdocument, gatoId: Types.ObjectId): TarefaResponseDTO {
  return {
    idTarefa: tarefa._id.toString(),
    gato_id: gatoId.toString(),
    descricao: tarefa.descricao,
    pontos: tarefa.pontos,
    status: tarefa.status,
    concluida_por: tarefa.concluida_por ? tarefa.concluida_por.toString() : null,
    concluida_em: tarefa.concluida_em,
  };
}

export class MongoDBTarefaRepository implements TarefaRepository {
  async findMany(idGato: string): Promise<TarefaResponseDTO[]> {
    if (!Types.ObjectId.isValid(idGato)) {
      return [];
    }

    const gato = await GatoSchemaModel.findById(idGato)
      .select(SOMENTE_TAREFAS)
      .lean<GatoComTarefas | null>();

    if (!gato) {
      return [];
    }

    return [...gato.tarefas]
      .reverse()
      .map((tarefa) => toTarefaResponse(tarefa, gato._id));
  }

  async findById(idTarefa: string): Promise<TarefaResponseDTO | undefined> {
    if (!Types.ObjectId.isValid(idTarefa)) {
      return undefined;
    }

    const gato = await GatoSchemaModel.findOne({ 'tarefas._id': new Types.ObjectId(idTarefa) })
      .select(SOMENTE_TAREFAS)
      .lean<GatoComTarefas | null>();

    const tarefa = gato?.tarefas.find((item) => item._id.toString() === idTarefa);

    return gato && tarefa ? toTarefaResponse(tarefa, gato._id) : undefined;
  }

  async create(data: CreateTarefaRepositoryInput): Promise<{ insertId: string }> {
    if (!Types.ObjectId.isValid(data.gato_id)) {
      throw new Error('Gato não encontrado para criar a tarefa.');
    }

    const idTarefa = new Types.ObjectId();

    const result = await GatoSchemaModel.updateOne(
      { _id: data.gato_id },
      {
        $push: {
          tarefas: {
            _id: idTarefa,
            descricao: data.descricao,
            pontos: data.pontos,
            status: data.status,
            concluida_por: data.concluida_por ? new Types.ObjectId(data.concluida_por) : null,
            concluida_em: data.concluida_em,
          },
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new Error('Gato não encontrado para criar a tarefa.');
    }

    return { insertId: idTarefa.toString() };
  }

  async delete(idTarefa: string): Promise<void> {
    if (!Types.ObjectId.isValid(idTarefa)) {
      return;
    }

    await GatoSchemaModel.updateOne(
      { 'tarefas._id': new Types.ObjectId(idTarefa) },
      { $pull: { tarefas: { _id: new Types.ObjectId(idTarefa) } } },
    );
  }

  async update(idTarefa: string, data: UpdateTarefaRepositoryInput): Promise<void> {
    if (!Types.ObjectId.isValid(idTarefa)) {
      return;
    }

    await GatoSchemaModel.updateOne(
      { 'tarefas._id': new Types.ObjectId(idTarefa) },
      {
        $set: {
          'tarefas.$.descricao': data.descricao,
          'tarefas.$.pontos': data.pontos,
          'tarefas.$.status': data.status,
        },
      },
    );
  }

  async updateStatus(idTarefa: string, idCatSitter: string): Promise<void> {
    if (!Types.ObjectId.isValid(idTarefa) || !Types.ObjectId.isValid(idCatSitter)) {
      return;
    }

    await GatoSchemaModel.updateOne(
      { 'tarefas._id': new Types.ObjectId(idTarefa) },
      {
        $set: {
          'tarefas.$.status': 'CONCLUIDA',
          'tarefas.$.concluida_em': new Date(),
          'tarefas.$.concluida_por': new Types.ObjectId(idCatSitter),
        },
      },
    );
  }

  async addPoints(idCatSitter: string, pontos: number): Promise<void> {
    if (!Types.ObjectId.isValid(idCatSitter)) {
      return;
    }

    await UserSchemaModel.updateOne({ _id: idCatSitter }, { $inc: { pontuacao: pontos } });
  }
}

export const mongoDbTarefaRepository: TarefaRepository = new MongoDBTarefaRepository();
