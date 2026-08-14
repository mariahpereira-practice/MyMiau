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

    test('should find many gatos without filters', async () => {
        mockedDbQuery.mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.findMany();

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT g.*, COALESCE(u.username, \'\') AS tutorNome FROM gatos g'),
            [],
        );
        expect(result).toEqual([queryGatoRow]);
    });

    test('should find many gatos filtering by searchGato', async () => {
        mockedDbQuery.mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.findMany({ searchGato: 'Whiskers' });

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('LOWER(g.nomeGato) LIKE LOWER(?)'),
            ['%Whiskers%'],
        );
        expect(result).toEqual([queryGatoRow]);
    });

    test('should find many gatos filtering by searchTutor', async () => {
        mockedDbQuery.mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.findMany({ searchTutor: 'John' });

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('LOWER(u.username) LIKE LOWER(?)'),
            ['%John%'],
        );
        expect(result).toEqual([queryGatoRow]);
    });

    test('should find many gatos filtering by disponiveis', async () => {
        mockedDbQuery.mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.findMany({ disponiveis: true });

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('g.disponivel_para_cuidado = 1'),
            [],
        );
        expect(result).toEqual([queryGatoRow]);
    });

    test('should find many gatos filtering by tutorId', async () => {
        mockedDbQuery.mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.findMany({ tutorId: '10' });

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('g.tutor_id = ?'),
            [10],
        );
        expect(result).toEqual([queryGatoRow]);
    });

    test('should find gato by id', async () => {
        mockedDbQuery.mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.findGatoByIdGato(1);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('WHERE g.id = ?'),
            [1],
        );
        expect(result).toEqual(queryGatoRow);
    });

    test('should return null when gato by id is not found', async () => {
        mockedDbQuery.mockResolvedValueOnce([]);

        const result = await GatoModel.findGatoByIdGato(999);

        expect(result).toBeNull();
    });

    test('should create gato with valid data', async () => {
        const input: GatoCreateInputDTO = {
            nomeGato: 'Whiskers',
            idadeGato: 3,
            pesoGato: 4.5,
            peloGato: 1,
            racaGato: 'Siamese',
            idIcone: 2,
            tutor_id: 10,
        };

        mockedDbQuery
            .mockResolvedValueOnce({ insertId: 99 })
            .mockResolvedValueOnce([gatoRowFromDatabase]);

        const result = await GatoModel.createGato(input);

        expect(mockedDbQuery).toHaveBeenNthCalledWith(
            1,
            'INSERT INTO gatos (nomeGato, idadeGato, pesoGato, peloGato, racaGato, idIcone, tutor_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [input.nomeGato, input.idadeGato, input.pesoGato, input.peloGato, input.racaGato, input.idIcone, input.tutor_id],
        );
        expect(mockedDbQuery).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('WHERE g.id = ?'),
            [99],
        );
        expect(result).toEqual(queryGatoRow);
    });

    test('should throw error if create gato does not return the created row', async () => {
        const input: GatoCreateInputDTO = {
            nomeGato: 'Whiskers',
            idadeGato: 3,
            pesoGato: 4.5,
            peloGato: 1,
            racaGato: 'Siamese',
            idIcone: 2,
            tutor_id: 10,
        };

        mockedDbQuery
            .mockResolvedValueOnce({ insertId: 99 })
            .mockResolvedValueOnce([]);

        await expect(GatoModel.createGato(input)).rejects.toThrow('Failed to create gato.');
    });

    test('should update gato with valid data', async () => {
        mockedDbQuery.mockResolvedValueOnce({ affectedRows: 1 });

        await GatoModel.updateGato(1, {
            nomeGato: 'Whiskers Updated',
            idadeGato: 4,
            pesoGato: 5,
            peloGato: 2,
            racaGato: 'Persian',
            idIcone: 3,
            disponivel_para_cuidado: 0,
        });

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE gatos'),
            ['Whiskers Updated', 4, 5, 2, 'Persian', 3, 0, 1],
        );
    });
});
