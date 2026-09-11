import { Types } from 'mongoose';
import type {
  GatoCreateInputDTO,
  GatoListFiltersInputDTO,
  GatoResponseDTO,
} from '../../dtos/gato.dto';
import type { GatoRepository, GatoUpdateRepositoryInput } from '../gato.repository';
import { GatoDocument, GatoSchemaModel } from './schemas/gato.schema';
import { UserDocument, UserSchemaModel } from './schemas/user.schema';

type GatoQuery = {
  tutor_id?: Types.ObjectId | { $in: Types.ObjectId[] };
  disponivel_para_cuidado?: 0 | 1;
  nomeGato?: { $regex: string; $options: string };
};

// Entrada do usuario vira regex: escapar evita injecao de padrao e ReDoS.
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toGatoResponse(doc: GatoDocument, tutorNome: string): GatoResponseDTO {
  return {
    id: doc._id.toString(),
    nomeGato: doc.nomeGato,
    idadeGato: doc.idadeGato,
    pesoGato: doc.pesoGato,
    peloGato: doc.peloGato,
    racaGato: doc.racaGato,
    idIcone: doc.idIcone,
    tutor_id: doc.tutor_id.toString(),
    tutorNome,
    disponivel_para_cuidado: doc.disponivel_para_cuidado,
  };
}

export class MongoDBRepository implements GatoRepository {
  // Substitui o LEFT JOIN com Users do MariaDB.
  private async __resolveTutorNomes(docs: GatoDocument[]): Promise<Map<string, string>> {
    const tutorIds = [...new Set(docs.map((doc) => doc.tutor_id.toString()))];
    const tutores = await UserSchemaModel.find({ _id: { $in: tutorIds } })
      .select({ username: 1 })
      .lean<Pick<UserDocument, '_id' | 'username'>[]>();

    return new Map(tutores.map((tutor) => [tutor._id.toString(), tutor.username]));
  }

  async findMany(filters: GatoListFiltersInputDTO = {}): Promise<GatoResponseDTO[]> {
    const query: GatoQuery = {};

    if (filters.tutorId !== undefined && filters.tutorId !== null && String(filters.tutorId).trim() !== '') {
      const tutorId = String(filters.tutorId).trim();
      if (!Types.ObjectId.isValid(tutorId)) {
        return [];
      }
      query.tutor_id = new Types.ObjectId(tutorId);
    }

    if (filters.disponiveis === true) {
      query.disponivel_para_cuidado = 1;
    }

    if (filters.searchGato && String(filters.searchGato).trim() !== '') {
      query.nomeGato = { $regex: escapeRegex(String(filters.searchGato).trim()), $options: 'i' };
    }

    if (filters.searchTutor && String(filters.searchTutor).trim() !== '') {
      const tutores = await UserSchemaModel.find({
        username: { $regex: escapeRegex(String(filters.searchTutor).trim()), $options: 'i' },
      })
        .select({ _id: 1 })
        .lean<Pick<UserDocument, '_id'>[]>();

      query.tutor_id = { $in: tutores.map((tutor) => tutor._id) };
    }

    const docs = await GatoSchemaModel.find(query).sort({ _id: -1 }).lean<GatoDocument[]>();
    const tutorNomes = await this.__resolveTutorNomes(docs);

    return docs.map((doc) => toGatoResponse(doc, tutorNomes.get(doc.tutor_id.toString()) ?? ''));
  }

  async findById(id: string): Promise<GatoResponseDTO | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await GatoSchemaModel.findById(id).lean<GatoDocument | null>();

    if (!doc) {
      return null;
    }

    const tutorNomes = await this.__resolveTutorNomes([doc]);
    return toGatoResponse(doc, tutorNomes.get(doc.tutor_id.toString()) ?? '');
  }

  async create(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    const created = await GatoSchemaModel.create({
      nomeGato: data.nomeGato,
      idadeGato: data.idadeGato,
      pesoGato: data.pesoGato,
      peloGato: data.peloGato,
      racaGato: data.racaGato,
      idIcone: data.idIcone,
      tutor_id: new Types.ObjectId(data.tutor_id),
      disponivel_para_cuidado: 0,
      tarefas: [],
    });

    const newGato = await this.findById(created._id.toString());
    if (!newGato) {
      throw new Error('Failed to create gato.');
    }
    return newGato;
  }

  async update(id: string, data: GatoUpdateRepositoryInput): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      return;
    }

    await GatoSchemaModel.updateOne(
      { _id: id },
      {
        $set: {
          nomeGato: data.nomeGato,
          idadeGato: data.idadeGato,
          pesoGato: data.pesoGato,
          peloGato: data.peloGato,
          racaGato: data.racaGato,
          idIcone: data.idIcone,
          disponivel_para_cuidado: data.disponivel_para_cuidado,
        },
      },
    );
  }
}

export const mongoDbGatoRepository: GatoRepository = new MongoDBRepository();
