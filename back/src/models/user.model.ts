import { UserProfileResponseDTO, UserRole } from '../dtos/user.dto';
import { userRepository } from '../repositories/user.repository';

export interface UserRow extends UserProfileResponseDTO {
  password_hash: string;
}

export class UserModel {
  private __userRow: UserRow | null;

  constructor(data: { user: UserRow }) {
    this.__userRow = data.user;
  }

  get id(): number | null {
    return this.__userRow?.id || null;
  }

  get username(): string | null {
    return this.__userRow?.username || null;
  }

  get email(): string | null {
    return this.__userRow?.email || null;
  }

  get role(): UserRole | null {
    return this.__userRow?.role || null;
  }

  get pontuacao(): number | string | null {
    return this.__userRow?.pontuacao || null;
  }

  get rankGlobal(): string | null {
    return this.__userRow?.rankGlobal || null;
  }

  get passwordHash(): string | null {
    return this.__userRow?.password_hash || null;
  }

  toProfileResponse(): UserProfileResponseDTO | null {
    if (!this.__userRow) {
      return null;
    }

    const profile: UserProfileResponseDTO = {
      id: this.id as number,
      username: this.username as string,
      email: this.email as string,
      role: this.role ?? UserRole.TUTOR,
    };

    if (this.pontuacao !== null) {
      profile.pontuacao = this.pontuacao;
    }

    if (this.rankGlobal !== null) {
      profile.rankGlobal = this.rankGlobal;
    }

    return profile;
  }

  private static __normalizeUser(row: UserRow | null): UserRow | null {
    if (!row) {
      return null;
    }

    return {
      ...row,
      id: Number(row.id),
      role: (row.role as UserRole) || UserRole.TUTOR,
    };
  }

  static async findByEmail(email: string): Promise<UserRow | null> {
    return UserModel.__normalizeUser(await userRepository.findByEmail(email));
  }

  static async findByUsername(username: string): Promise<UserRow | null> {
    return UserModel.__normalizeUser(await userRepository.findByUsername(username));
  }

  static async findById(id: number): Promise<UserRow | null> {
    return UserModel.__normalizeUser(await userRepository.findById(id));
  }

  static async create({
    username,
    email,
    password_hash,
    role,
  }: {
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
  }): Promise<{ insertId: number | string }> {
    return userRepository.create({ username, email, password_hash, role });
  }
}
