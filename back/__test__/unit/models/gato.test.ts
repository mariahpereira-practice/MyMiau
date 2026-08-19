import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import db from '../../../src/config/database';
import { GatoCreateInputDTO, GatoResponseDTO } from '../../../src/dtos/gato.dto';
import { GatoModel } from '../../../src/models/gato.model';

jest.mock('../../../src/config/database', () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        pool: {},
    },
}));

describe('Gato Model', () => {
    const mockedDbQuery = db.query as any;

    const gatoRowFromDatabase = {
        id: '1',
        nomeGato: 'Whiskers',
        idadeGato: 3,
        pesoGato: '4.5',
        peloGato: '1',
        racaGato: 'Siamese',
        idIcone: 2,
        tutor_id: 10,
        tutorNome: 'John Doe',
        disponivel_para_cuidado: undefined,
    } as any;

    const normalizedGatoRow: GatoResponseDTO = {
        id: 1,
        nomeGato: 'Whiskers',
        idadeGato: 3,
        pesoGato: 4.5,
        peloGato: 1,
        racaGato: 'Siamese',
        idIcone: 2,
        tutor_id: 10,
        tutorNome: 'John Doe',
        disponivel_para_cuidado: 1,
    };

    const queryGatoRow: GatoResponseDTO = {
        id: 1,
        nomeGato: 'Whiskers',
        idadeGato: 3,
        pesoGato: '4.5' as any,
        peloGato: 1,
        racaGato: 'Siamese',
        idIcone: 2,
        tutor_id: 10,
        tutorNome: 'John Doe',
        disponivel_para_cuidado: 1,
    };

    let gato!: GatoModel;
    let gatoResponse!: ReturnType<GatoModel['toResponse']>;

    beforeEach(() => {
        jest.clearAllMocks();
        gato = new GatoModel({ gato: normalizedGatoRow });
        gatoResponse = gato.toResponse();
    });

    test('should create a gato with valid properties', () => {
        expect(gato.id).toBe(1);
        expect(gato.nomeGato).toBe('Whiskers');
        expect(gato.idadeGato).toBe(3);
        expect(gato.pesoGato).toBe(4.5);
        expect(gato.peloGato).toBe(1);
        expect(gato.racaGato).toBe('Siamese');
        expect(gato.idIcone).toBe(2);
        expect(gato.tutorId).toBe(10);
        expect(gato.tutorNome).toBe('John Doe');
        expect(gato.disponivelParaCuidado).toBe(1);
    });

    test('should return null for properties if gato data is null', () => {
        const emptyGato = new GatoModel({ gato: null as any });

        expect(emptyGato.id).toBeNull();
        expect(emptyGato.nomeGato).toBeNull();
        expect(emptyGato.idadeGato).toBeNull();
        expect(emptyGato.pesoGato).toBeNull();
        expect(emptyGato.peloGato).toBeNull();
        expect(emptyGato.racaGato).toBeNull();
        expect(emptyGato.idIcone).toBeNull();
        expect(emptyGato.tutorId).toBeNull();
        expect(emptyGato.tutorNome).toBeNull();
        expect(emptyGato.disponivelParaCuidado).toBeNull();
    });

    test('should return null when required response properties are missing', () => {
        const incompleteGato = new GatoModel({
            gato: {
                ...normalizedGatoRow,
                tutor_id: null as any,
            },
        });

        expect(incompleteGato.toResponse()).toBeNull();
    });

    test('should turn the gato to a gato response', () => {
        expect(gatoResponse).toEqual(normalizedGatoRow);
    });

    test('should return null for gato response if gato data is null', () => {
        const emptyGato = new GatoModel({ gato: null as any });

        expect(emptyGato.toResponse()).toBeNull();
    });

});
