import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthTokenPayloadDTO, UserProfileResponseDTO } from '../dtos/user.dto';
import { UserModel } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

export async function authenticateUser(req: Request): Promise<UserProfileResponseDTO> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw Object.assign(new Error('Token não fornecido.'), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw Object.assign(new Error('Token inválido ou expirado.'), { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & AuthTokenPayloadDTO;
    const userId = Number(payload.id);
    if (!payload.id || Number.isNaN(userId)) {
      throw new Error('Token inválido ou expirado.');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Token inválido ou expirado.');
    }

    const normalizedUser = new UserModel({ user }).toProfileResponse();
    if (!normalizedUser) {
      throw new Error('Token inválido ou expirado.');
    }

    return normalizedUser;
  } catch (_error) {
    throw Object.assign(new Error('Token inválido ou expirado.'), { status: 401 });
  }
}
