import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { authService } from '../../services/auth.service';
import { UserRole } from '../../dtos/user.dto';

jest.mock('../../services/auth.service', () => ({
  authService: {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  },
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    test('fazendo login como tutor', async () => {
      const body = {
        identifier: 'juliana@email.com',
        password: 'senha123',
      };

      (authService.loginUser as any).mockResolvedValue({
        token: 'jwt-login-token',
        role: 'TUTOR',
        user: {
          id: 2,
          username: 'juliana',
          email: 'juliana@email.com',
          role: 'TUTOR',
          pontuacao: 0,
          rankGlobal: 'No rank',
        },
      });

      const response = await request(app).post('/api/auth/login').send(body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('role');
      expect(response.body.user).toEqual({
        id: 2,
        username: 'juliana',
        email: 'juliana@email.com',
        role: 'TUTOR',
        pontuacao: 0,
        rankGlobal: 'No rank',
      });
      expect(authService.loginUser).toHaveBeenCalledWith(body);
    });

    test('fazendo login como catsitter', async () => {
      const body = {
        identifier: 'heloisa@email.com',
        password: 'senha123',
      };

      (authService.loginUser as any).mockResolvedValue({
        token: 'jwt-login-token-catsitter',
        role: 'CATSITTER',
        user: {
          id: 1,
          username: 'heloisa',
          email: 'heloisa@email.com',
          role: 'CATSITTER',
          pontuacao: 80,
          rankGlobal: 'No rank',
        },
      });

      const response = await request(app).post('/api/auth/login').send(body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('role');
      expect(response.body.user).toEqual({
        id: 1,
        username: 'heloisa',
        email: 'heloisa@email.com',
        role: 'CATSITTER',
        pontuacao: 80,
        rankGlobal: 'No rank',
      });
      expect(authService.loginUser).toHaveBeenCalledWith(body);
    });
  });

  describe('POST /api/auth/register', () => {
    test('fazendo registro de um usuario', async () => {
      const body = {
        username: 'novoUsuario',
        email: 'novoUsuario@email.com',
        password: 'senha123',
        role: UserRole.TUTOR,
      };

      (authService.registerUser as any).mockResolvedValue({
        token: 'jwt-register-token',
        role: UserRole.TUTOR,
        user: {
          id: 999,
          username: 'novoUsuario',
          email: 'novoUsuario@email.com',
          role: 'TUTOR',
          pontuacao: 0,
          rankGlobal: 'No rank',
        },
      });

      const response = await request(app).post('/api/auth/register').send(body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('role');
      expect(response.body.user).toEqual({
        id: 999,
        username: 'novoUsuario',
        email: 'novoUsuario@email.com',
        role: 'TUTOR',
        pontuacao: 0,
        rankGlobal: 'No rank',
      });
      expect(authService.registerUser).toHaveBeenCalledWith(body);
    });
  });
});
