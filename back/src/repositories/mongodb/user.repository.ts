import { Types } from 'mongoose';
import type { UserRow } from '../../models/user.model';
import type {
  CreateUserRepositoryInput,
  InsertResult,
  UserRepository,
} from '../user.repository';
import { UserDocument, UserSchemaModel } from './schemas/user.schema';

function toUserRow(doc: UserDocument): UserRow {
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    role: doc.role,
    pontuacao: doc.pontuacao,
    rankGlobal: doc.rankGlobal,
    password_hash: doc.password_hash,
  };
}

export class MongoDBUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserRow | null> {
    const doc = await UserSchemaModel.findOne({ email }).lean<UserDocument | null>();
    return doc ? toUserRow(doc) : null;
  }

  async findByUsername(username: string): Promise<UserRow | null> {
    const doc = await UserSchemaModel.findOne({ username }).lean<UserDocument | null>();
    return doc ? toUserRow(doc) : null;
  }

  async findById(id: string): Promise<UserRow | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await UserSchemaModel.findById(id).lean<UserDocument | null>();
    return doc ? toUserRow(doc) : null;
  }

  async create(data: CreateUserRepositoryInput): Promise<InsertResult> {
    const created = await UserSchemaModel.create({
      username: data.username,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role,
      pontuacao: 0,
      rankGlobal: '',
    });

    return { insertId: created._id.toString() };
  }
}

export const mongoDbUserRepository: UserRepository = new MongoDBUserRepository();
