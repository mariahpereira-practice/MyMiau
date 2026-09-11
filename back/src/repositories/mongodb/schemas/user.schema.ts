import mongoose, { Schema, Types } from 'mongoose';
import { UserRole } from '../../../dtos/user.dto';

export interface UserDocument {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  pontuacao: number;
  rankGlobal: string;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    pontuacao: { type: Number, required: true, default: 0 },
    rankGlobal: { type: String, default: '' },
  },
  { versionKey: false, collection: 'Users' },
);

export const UserSchemaModel = mongoose.model<UserDocument>('User', userSchema);
