"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const dto_validators_1 = require("../../../validators/dto.validators");
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
(0, globals_1.describe)('DTO validators', () => {
    (0, globals_1.describe)('validateRegisterUser', () => {
        (0, globals_1.test)('aceita cadastro completo com role válida', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateRegisterUser)({
                username: 'juliana',
                email: 'juliana@email.com',
                password: 'senha123',
                role: 'TUTOR',
            })).toEqual([]);
        });
        (0, globals_1.test)('aceita cadastro sem role, usando o padrão da aplicação', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateRegisterUser)({
                username: 'juliana',
                email: 'juliana@email.com',
                password: 'senha123',
            })).toEqual([]);
        });
        globals_1.test.each([
            undefined,
            null,
            [],
            'texto',
        ])('rejeita corpo que não seja objeto: %p', (body) => {
            (0, globals_1.expect)((0, dto_validators_1.validateRegisterUser)(body)).toEqual(['O corpo da requisição deve ser um objeto.']);
        });
        (0, globals_1.test)('rejeita campos obrigatórios ausentes ou vazios', () => {
            const errors = (0, dto_validators_1.validateRegisterUser)({ username: ' ', email: '', password: undefined });
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'username é obrigatório.',
                'email é obrigatório.',
                'password é obrigatório.',
            ]));
        });
        (0, globals_1.test)('rejeita role inválida e campo desconhecido', () => {
            const errors = (0, dto_validators_1.validateRegisterUser)({
                username: 'juliana',
                email: 'juliana@email.com',
                password: 'senha123',
                role: 'VISITANTE',
                extra: true,
            });
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'role deve ser TUTOR, CATSITTER, MODERATOR ou ADMIN.',
                'extra não é permitido.',
            ]));
        });
    });
    (0, globals_1.describe)('validateLoginUser', () => {
        (0, globals_1.test)('aceita login válido', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateLoginUser)({
                identifier: 'juliana@email.com',
                password: 'senha123',
            })).toEqual([]);
        });
        (0, globals_1.test)('rejeita identifier e password ausentes ou vazios', () => {
            const errors = (0, dto_validators_1.validateLoginUser)({ identifier: ' ', password: null });
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'identifier é obrigatório.',
                'password é obrigatório.',
            ]));
        });
        (0, globals_1.test)('rejeita campo desconhecido', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateLoginUser)({ identifier: 'juliana', password: 'senha123', role: 'TUTOR' }))
                .toContain('role não é permitido.');
        });
    });
    (0, globals_1.describe)('validateCreateGato', () => {
        (0, globals_1.test)('aceita gato completo', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateCreateGato)(validGato)).toEqual([]);
        });
        (0, globals_1.test)('aceita gato sem disponibilidade e com booleano de disponibilidade', () => {
            const { disponivel_para_cuidado: _ignored, ...gatoSemDisponibilidade } = validGato;
            (0, globals_1.expect)((0, dto_validators_1.validateCreateGato)(gatoSemDisponibilidade)).toEqual([]);
            (0, globals_1.expect)((0, dto_validators_1.validateCreateGato)({ ...validGato, disponivel_para_cuidado: true })).toEqual([]);
            (0, globals_1.expect)((0, dto_validators_1.validateCreateGato)({ ...validGato, disponivel_para_cuidado: false })).toEqual([]);
        });
        (0, globals_1.test)('rejeita corpo não objeto', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateCreateGato)(null)).toEqual(['O corpo da requisição deve ser um objeto.']);
        });
        (0, globals_1.test)('rejeita campos obrigatórios ausentes', () => {
            const errors = (0, dto_validators_1.validateCreateGato)({});
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'nomeGato é obrigatório.',
                'idadeGato deve ser um número inteiro não negativo.',
                'pesoGato deve ser um número positivo.',
                'peloGato deve ser um número inteiro não negativo.',
                'racaGato é obrigatória.',
                'idIcone deve ser um número inteiro positivo.',
            ]));
        });
        globals_1.test.each([
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
            (0, globals_1.expect)((0, dto_validators_1.validateCreateGato)({ ...validGato, [field]: value })).not.toEqual([]);
        });
        (0, globals_1.test)('rejeita nome e raça vazios, disponibilidade inválida e campo desconhecido', () => {
            const errors = (0, dto_validators_1.validateCreateGato)({
                ...validGato,
                nomeGato: ' ',
                racaGato: '',
                disponivel_para_cuidado: 2,
                tutor_id: 10,
            });
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'nomeGato é obrigatório.',
                'racaGato é obrigatória.',
                'disponivel_para_cuidado deve ser 0 ou 1.',
                'tutor_id não é permitido.',
            ]));
        });
    });
    (0, globals_1.describe)('validateUpdateGato', () => {
        (0, globals_1.test)('aceita atualização parcial válida', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateGato)({ nomeGato: 'Luna' })).toEqual([]);
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateGato)({ pesoGato: 4.2, disponivel_para_cuidado: 0 })).toEqual([]);
        });
        (0, globals_1.test)('aceita corpo vazio para preservar o tratamento legado da action', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateGato)({})).toEqual([]);
        });
        (0, globals_1.test)('rejeita campos presentes com valores inválidos', () => {
            const errors = (0, dto_validators_1.validateUpdateGato)({
                nomeGato: '',
                idadeGato: -1,
                pesoGato: 0,
                peloGato: 1.2,
                racaGato: ' ',
                idIcone: 0,
                disponivel_para_cuidado: 'sim',
            });
            (0, globals_1.expect)(errors).toHaveLength(7);
        });
        (0, globals_1.test)('rejeita campo desconhecido', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateGato)({ tutor_id: 2 })).toContain('tutor_id não é permitido.');
        });
    });
    (0, globals_1.describe)('validateCreateTarefa', () => {
        (0, globals_1.test)('aceita tarefa válida', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateCreateTarefa)(validTarefa)).toEqual([]);
        });
        (0, globals_1.test)('rejeita corpo não objeto', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateCreateTarefa)([])).toEqual(['O corpo da requisição deve ser um objeto.']);
        });
        (0, globals_1.test)('rejeita descrição ausente ou vazia e pontos inválidos', () => {
            const errors = (0, dto_validators_1.validateCreateTarefa)({ descricao: ' ', pontos: 0 });
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'descricao é obrigatória.',
                'pontos deve ser um número positivo.',
            ]));
        });
        (0, globals_1.test)('rejeita pontos não numéricos ou infinitos', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateCreateTarefa)({ descricao: 'Escovar', pontos: '10' })).toContain('pontos deve ser um número positivo.');
            (0, globals_1.expect)((0, dto_validators_1.validateCreateTarefa)({ descricao: 'Escovar', pontos: Infinity })).toContain('pontos deve ser um número positivo.');
        });
        (0, globals_1.test)('rejeita campo desconhecido', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateCreateTarefa)({ ...validTarefa, status: 'PENDENTE' }))
                .toContain('status não é permitido.');
        });
    });
    (0, globals_1.describe)('validateUpdateTarefa', () => {
        (0, globals_1.test)('aceita atualização parcial válida', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateTarefa)({ descricao: 'Dar remédio' })).toEqual([]);
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateTarefa)({ pontos: 5, status: 'CONCLUIDA' })).toEqual([]);
        });
        (0, globals_1.test)('aceita corpo vazio para preservar o fluxo de conclusão do catsitter', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateTarefa)({})).toEqual([]);
        });
        (0, globals_1.test)('rejeita descrição vazia, pontos inválidos e status inválido', () => {
            const errors = (0, dto_validators_1.validateUpdateTarefa)({ descricao: '', pontos: -1, status: 'CANCELADA' });
            (0, globals_1.expect)(errors).toEqual(globals_1.expect.arrayContaining([
                'descricao deve ser um texto não vazio.',
                'pontos deve ser um número positivo.',
                'status deve ser PENDENTE ou CONCLUIDA.',
            ]));
        });
        (0, globals_1.test)('rejeita campo desconhecido', () => {
            (0, globals_1.expect)((0, dto_validators_1.validateUpdateTarefa)({ concluida_por: 3 })).toContain('concluida_por não é permitido.');
        });
    });
});
//# sourceMappingURL=dto.validators.test.js.map