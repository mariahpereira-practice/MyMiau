import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { LoginUserInputDTO, RegisterUserInputDTO, UserRole } from '../../../src/dtos/user.dto';
import { AuthService } from '../../../src/services/auth.service';
import { AuthActionResult } from '../../../src/models/authAction';

const registerRunMock = jest.fn<() => Promise<AuthActionResult>>();
const loginRunMock = jest.fn<() => Promise<AuthActionResult>>();
const registerCtorSpy = jest.fn();
const loginCtorSpy = jest.fn();

jest.mock('../../../src/models/authAction', () => {
  const actual = jest.requireActual('../../../src/models/authAction') as typeof import('../../../src/models/authAction');

  class FakeRegisterUserAction extends actual.RegisterUserAction {
    constructor(input: RegisterUserInputDTO, jwtSecret: string) {
      super(input, jwtSecret);
      registerCtorSpy(input, jwtSecret);
    }

    run(): Promise<AuthActionResult> {
      return registerRunMock();
    }
  }

  class FakeLoginUserAction extends actual.LoginUserAction {
    constructor(input: LoginUserInputDTO, jwtSecret: string) {
      super(input, jwtSecret);
      loginCtorSpy(input, jwtSecret);
    }

    run(): Promise<AuthActionResult> {
      return loginRunMock();
    }
  }

  return {
    ...actual,
    RegisterUserAction: FakeRegisterUserAction,
    LoginUserAction: FakeLoginUserAction,
  };
});

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  test('should call RegisterUserAction with input and jwt secret', async () => {
    const service = new AuthService();
    const input: RegisterUserInputDTO = {
      username: 'novoUsuario',
      email: 'novo@user.com',
      password: 'senha123',
      role: UserRole.TUTOR,
    };

    const expected: AuthActionResult = {
      token: 'register-token',
      role: UserRole.TUTOR,
      user: {
        id: 10,
        username: 'novoUsuario',
        email: 'novo@user.com',
        role: UserRole.TUTOR,
      },
    };

    registerRunMock.mockResolvedValue(expected);

    const result = await service.registerUser(input);

    expect(registerCtorSpy).toHaveBeenCalledWith(input, 'test-jwt-secret');
    expect(registerRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  test('should call LoginUserAction with input and jwt secret', async () => {
    const service = new AuthService();
    const input: LoginUserInputDTO = {
      identifier: 'novo@user.com',
      password: 'senha123',
    };

    const expected: AuthActionResult = {
      token: 'login-token',
      role: UserRole.CATSITTER,
      user: {
        id: 11,
        username: 'catsitter',
        email: 'novo@user.com',
        role: UserRole.CATSITTER,
      },
    };

    loginRunMock.mockResolvedValue(expected);

    const result = await service.loginUser(input);

    expect(loginCtorSpy).toHaveBeenCalledWith(input, 'test-jwt-secret');
    expect(loginRunMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

});
