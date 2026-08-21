import { Request } from 'express';
import { authenticateUser } from './authenticator';

export async function expressAuthentication(
  request: Request,
  securityName: string,
): Promise<unknown> {
  if (securityName !== 'jwt') {
    throw new Error(`Estratégia de autenticação não suportada: ${securityName}`);
  }

  return authenticateUser(request);
}