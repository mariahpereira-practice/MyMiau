import { describe, expect, test } from '@jest/globals';
import {
  validateCreateGato,
  validateCreateTarefa,
  validateLoginUser,
  validateRegisterUser,
  validateUpdateGato,
  validateUpdateTarefa,
} from '../../../validators/dto.validators';

const validGato = {
  nomeGato: 'Marley',
  idadeGato: 3,
  pesoGato: 4.5,
  peloGato: 2,
  racaGato: 'Siamese',
  idIcone: 1,
  disponivel_para_cuidado: 1,
};

const validTarefa = {
  descricao: 'Escovar o gato',
  pontos: 10,
};

describe('DTO validators', () => {
  describe('validateRegisterUser', () => {
    test('aceita cadastro completo com role válida', () => {
      expect(validateRegisterUser({
        username: 'juliana',
        email: 'juliana@email.com',
        password: 'senha123',
        role: 'TUTOR',
      })).toEqual([]);
    });

    test('aceita cadastro sem role, usando o padrão da aplicação', () => {
      expect(validateRegisterUser({
        username: 'juliana',
        email: 'juliana@email.com',
        password: 'senha123',
      })).toEqual([]);
    });

    test.each([
      undefined,
      null,
      [],
      'texto',
    ])('rejeita corpo que não seja objeto: %p', (body) => {
      expect(validateRegisterUser(body)).toEqual(['O corpo da requisição deve ser um objeto.']);
    });

    test('rejeita campos obrigatórios ausentes ou vazios', () => {
      const errors = validateRegisterUser({ username: ' ', email: '', password: undefined });
      expect(errors).toEqual(expect.arrayContaining([
        'username é obrigatório.',
        'email é obrigatório.',
        'password é obrigatório.',
      ]));
    });

    test('rejeita role inválida e campo desconhecido', () => {
      const errors = validateRegisterUser({
        username: 'juliana',
        email: 'juliana@email.com',
        password: 'senha123',
        role: 'VISITANTE',
        extra: true,
      });
      expect(errors).toEqual(expect.arrayContaining([
        'role deve ser TUTOR, CATSITTER, MODERATOR ou ADMIN.',
        'extra não é permitido.',
      ]));
    });
  });

  describe('validateLoginUser', () => {
    test('aceita login válido', () => {
      expect(validateLoginUser({
        identifier: 'juliana@email.com',
        password: 'senha123',
      })).toEqual([]);
    });

    test('rejeita identifier e password ausentes ou vazios', () => {
      const errors = validateLoginUser({ identifier: ' ', password: null });
      expect(errors).toEqual(expect.arrayContaining([
        'identifier é obrigatório.',
        'password é obrigatório.',
      ]));
    });

    test('rejeita campo desconhecido', () => {
      expect(validateLoginUser({ identifier: 'juliana', password: 'senha123', role: 'TUTOR' }))
        .toContain('role não é permitido.');
    });
  });

  describe('validateCreateGato', () => {
    test('aceita gato completo', () => {
      expect(validateCreateGato(validGato)).toEqual([]);
    });

    test('aceita gato sem disponibilidade e com booleano de disponibilidade', () => {
      const { disponivel_para_cuidado: _ignored, ...gatoSemDisponibilidade } = validGato;
      expect(validateCreateGato(gatoSemDisponibilidade)).toEqual([]);
      expect(validateCreateGato({ ...validGato, disponivel_para_cuidado: true })).toEqual([]);
      expect(validateCreateGato({ ...validGato, disponivel_para_cuidado: false })).toEqual([]);
    });

    test('rejeita corpo não objeto', () => {
      expect(validateCreateGato(null)).toEqual(['O corpo da requisição deve ser um objeto.']);
    });

    test('rejeita campos obrigatórios ausentes', () => {
      const errors = validateCreateGato({});
      expect(errors).toEqual(expect.arrayContaining([
        'nomeGato é obrigatório.',
        'idadeGato deve ser um número inteiro não negativo.',
        'pesoGato deve ser um número positivo.',
        'peloGato deve ser um número inteiro não negativo.',
        'racaGato é obrigatória.',
        'idIcone deve ser um número inteiro positivo.',
      ]));
    });

    test.each([
      ['idadeGato', -1],
      ['idadeGato', 1.5],
      ['idadeGato', '3'],
      ['pesoGato', 0],
      ['pesoGato', -1],
      ['pesoGato', '4.5'],
      ['peloGato', -1],
      ['peloGato', 1.5],
      ['peloGato', '2'],
      ['idIcone', 0],
      ['idIcone', -1],
      ['idIcone', 1.5],
      ['idIcone', '1'],
    ])('rejeita valor inválido em %s: %p', (field, value) => {
      expect(validateCreateGato({ ...validGato, [field]: value })).not.toEqual([]);
    });

    test('rejeita nome e raça vazios, disponibilidade inválida e campo desconhecido', () => {
      const errors = validateCreateGato({
        ...validGato,
        nomeGato: ' ',
        racaGato: '',
        disponivel_para_cuidado: 2,
        tutor_id: 10,
      });
      expect(errors).toEqual(expect.arrayContaining([
        'nomeGato é obrigatório.',
        'racaGato é obrigatória.',
        'disponivel_para_cuidado deve ser 0 ou 1.',
        'tutor_id não é permitido.',
      ]));
    });
  });

  describe('validateUpdateGato', () => {
    test('aceita atualização parcial válida', () => {
      expect(validateUpdateGato({ nomeGato: 'Luna' })).toEqual([]);
      expect(validateUpdateGato({ pesoGato: 4.2, disponivel_para_cuidado: 0 })).toEqual([]);
    });

    test('aceita corpo vazio para preservar o tratamento legado da action', () => {
      expect(validateUpdateGato({})).toEqual([]);
    });

    test('rejeita campos presentes com valores inválidos', () => {
      const errors = validateUpdateGato({
        nomeGato: '',
        idadeGato: -1,
        pesoGato: 0,
        peloGato: 1.2,
        racaGato: ' ',
        idIcone: 0,
        disponivel_para_cuidado: 'sim',
      });
      expect(errors).toHaveLength(7);
    });

    test('rejeita campo desconhecido', () => {
      expect(validateUpdateGato({ tutor_id: 2 })).toContain('tutor_id não é permitido.');
    });
  });

  describe('validateCreateTarefa', () => {
    test('aceita tarefa válida', () => {
      expect(validateCreateTarefa(validTarefa)).toEqual([]);
    });

    test('rejeita corpo não objeto', () => {
      expect(validateCreateTarefa([])).toEqual(['O corpo da requisição deve ser um objeto.']);
    });

    test('rejeita descrição ausente ou vazia e pontos inválidos', () => {
      const errors = validateCreateTarefa({ descricao: ' ', pontos: 0 });
      expect(errors).toEqual(expect.arrayContaining([
        'descricao é obrigatória.',
        'pontos deve ser um número positivo.',
      ]));
    });

    test('rejeita pontos não numéricos ou infinitos', () => {
      expect(validateCreateTarefa({ descricao: 'Escovar', pontos: '10' })).toContain('pontos deve ser um número positivo.');
      expect(validateCreateTarefa({ descricao: 'Escovar', pontos: Infinity })).toContain('pontos deve ser um número positivo.');
    });

    test('rejeita campo desconhecido', () => {
      expect(validateCreateTarefa({ ...validTarefa, status: 'PENDENTE' }))
        .toContain('status não é permitido.');
    });
  });

  describe('validateUpdateTarefa', () => {
    test('aceita atualização parcial válida', () => {
      expect(validateUpdateTarefa({ descricao: 'Dar remédio' })).toEqual([]);
      expect(validateUpdateTarefa({ pontos: 5, status: 'CONCLUIDA' })).toEqual([]);
    });

    test('aceita corpo vazio para preservar o fluxo de conclusão do catsitter', () => {
      expect(validateUpdateTarefa({})).toEqual([]);
    });

    test('rejeita descrição vazia, pontos inválidos e status inválido', () => {
      const errors = validateUpdateTarefa({ descricao: '', pontos: -1, status: 'CANCELADA' });
      expect(errors).toEqual(expect.arrayContaining([
        'descricao deve ser um texto não vazio.',
        'pontos deve ser um número positivo.',
        'status deve ser PENDENTE ou CONCLUIDA.',
      ]));
    });

    test('rejeita campo desconhecido', () => {
      expect(validateUpdateTarefa({ concluida_por: 3 })).toContain('concluida_por não é permitido.');
    });
  });
});
