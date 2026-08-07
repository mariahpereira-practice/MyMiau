export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface UserProfileResponseDTO extends UserResponseDTO {
  pontuacao?: number | string;
  rankGlobal?: string;
}

export interface RegisterUserInputDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface LoginUserInputDTO {
  identifier?: string;
  password?: string;
}

export interface AuthTokenPayloadDTO {
  id?: unknown;
  role?: unknown;
}

export enum UserRole {
  TUTOR = 'TUTOR',
  CATSITTER = 'CATSITTER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}
