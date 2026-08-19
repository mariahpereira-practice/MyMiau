import { UserRole } from '../dtos/user.dto';
import type { BodyValidator } from './validate-body.middleware';

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

const hasOnlyKnownFields = (
  data: Record<string, unknown>,
  fields: string[],
): string[] => Object.keys(data)
  .filter((field) => !fields.includes(field))
  .map((field) => `${field} não é permitido.`);

const isNonEmptyString = (value: unknown): value is string => (
  typeof value === 'string' && value.trim().length > 0
);

const isNonNegativeNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value) && value >= 0
);

const isPositiveNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value) && value > 0
);

const isInteger = (value: unknown): value is number => (
  typeof value === 'number' && Number.isInteger(value)
);

const isBinaryValue = (value: unknown): value is 0 | 1 | boolean => (
  value === 0 || value === 1 || typeof value === 'boolean'
);

export const validateRegisterUser: BodyValidator = (body) => {
  if (!isRecord(body)) {
    return ['O corpo da requisição deve ser um objeto.'];
  }

  const errors = hasOnlyKnownFields(body, ['username', 'email', 'password', 'role']);
  if (!isNonEmptyString(body.username)) errors.push('username é obrigatório.');
  if (!isNonEmptyString(body.email)) errors.push('email é obrigatório.');
  if (!isNonEmptyString(body.password)) errors.push('password é obrigatório.');
  if (body.role !== undefined && !Object.values(UserRole).includes(body.role as UserRole)) {
    errors.push('role deve ser TUTOR, CATSITTER, MODERATOR ou ADMIN.');
  }

  return errors;
};

export const validateLoginUser: BodyValidator = (body) => {
  if (!isRecord(body)) {
    return ['O corpo da requisição deve ser um objeto.'];
  }

  const errors = hasOnlyKnownFields(body, ['identifier', 'password']);
  if (!isNonEmptyString(body.identifier)) errors.push('identifier é obrigatório.');
  if (!isNonEmptyString(body.password)) errors.push('password é obrigatório.');
  return errors;
};

const gatoFields = [
  'nomeGato',
  'idadeGato',
  'pesoGato',
  'peloGato',
  'racaGato',
  'idIcone',
  'disponivel_para_cuidado',
];

export const validateCreateGato: BodyValidator = (body) => {
  if (!isRecord(body)) {
    return ['O corpo da requisição deve ser um objeto.'];
  }

  const errors = hasOnlyKnownFields(body, gatoFields);
  if (!isNonEmptyString(body.nomeGato)) errors.push('nomeGato é obrigatório.');
  if (!isInteger(body.idadeGato) || !isNonNegativeNumber(body.idadeGato)) {
    errors.push('idadeGato deve ser um número inteiro não negativo.');
  }
  if (!isPositiveNumber(body.pesoGato)) errors.push('pesoGato deve ser um número positivo.');
  if (!isInteger(body.peloGato) || !isNonNegativeNumber(body.peloGato)) {
    errors.push('peloGato deve ser um número inteiro não negativo.');
  }
  if (!isNonEmptyString(body.racaGato)) errors.push('racaGato é obrigatória.');
  if (!isInteger(body.idIcone) || !isPositiveNumber(body.idIcone)) {
    errors.push('idIcone deve ser um número inteiro positivo.');
  }
  if (body.disponivel_para_cuidado !== undefined && !isBinaryValue(body.disponivel_para_cuidado)) {
    errors.push('disponivel_para_cuidado deve ser 0 ou 1.');
  }

  return errors;
};

export const validateUpdateGato: BodyValidator = (body) => {
  if (!isRecord(body)) {
    return ['O corpo da requisição deve ser um objeto.'];
  }

  const errors = hasOnlyKnownFields(body, gatoFields);
  if ('nomeGato' in body && !isNonEmptyString(body.nomeGato)) errors.push('nomeGato deve ser um texto não vazio.');
  if ('idadeGato' in body && (!isInteger(body.idadeGato) || !isNonNegativeNumber(body.idadeGato))) {
    errors.push('idadeGato deve ser um número inteiro não negativo.');
  }
  if ('pesoGato' in body && !isPositiveNumber(body.pesoGato)) errors.push('pesoGato deve ser um número positivo.');
  if ('peloGato' in body && (!isInteger(body.peloGato) || !isNonNegativeNumber(body.peloGato))) {
    errors.push('peloGato deve ser um número inteiro não negativo.');
  }
  if ('racaGato' in body && !isNonEmptyString(body.racaGato)) errors.push('racaGato deve ser um texto não vazio.');
  if ('idIcone' in body && (!isInteger(body.idIcone) || !isPositiveNumber(body.idIcone))) {
    errors.push('idIcone deve ser um número inteiro positivo.');
  }
  if ('disponivel_para_cuidado' in body && !isBinaryValue(body.disponivel_para_cuidado)) {
    errors.push('disponivel_para_cuidado deve ser 0 ou 1.');
  }

  return errors;
};

export const validateCreateTarefa: BodyValidator = (body) => {
  if (!isRecord(body)) {
    return ['O corpo da requisição deve ser um objeto.'];
  }

  const errors = hasOnlyKnownFields(body, ['descricao', 'pontos']);
  if (!isNonEmptyString(body.descricao)) errors.push('descricao é obrigatória.');
  if (!isPositiveNumber(body.pontos)) errors.push('pontos deve ser um número positivo.');
  return errors;
};

export const validateUpdateTarefa: BodyValidator = (body) => {
  if (!isRecord(body)) {
    return ['O corpo da requisição deve ser um objeto.'];
  }

  const errors = hasOnlyKnownFields(body, ['descricao', 'pontos', 'status']);
  if ('descricao' in body && !isNonEmptyString(body.descricao)) errors.push('descricao deve ser um texto não vazio.');
  if ('pontos' in body && !isPositiveNumber(body.pontos)) errors.push('pontos deve ser um número positivo.');
  if ('status' in body && body.status !== 'PENDENTE' && body.status !== 'CONCLUIDA') {
    errors.push('status deve ser PENDENTE ou CONCLUIDA.');
  }
  return errors;
};
