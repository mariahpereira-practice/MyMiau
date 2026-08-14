import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import db from '../../../src/config/database';
import { TarefaResponseDTO, TarefaStatus } from '../../../src/dtos/tarefa.dto';
import { TarefaModel } from '../../../src/models/tarefa.model';
import { GatoModel } from '../../../src/models/gato.model';

jest.mock('../../../src/config/database', () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        pool: {},
    },
}));

describe('Tarefa Model', () => {
    const mockedDbQuery = db.query as any;

    const tarefaRow = {
       idTarefa: 1,
       gato_id: 1,
       descricao: 'Sample Task',
       pontos: 10,
       status: 'PENDENTE',
       concluida_por: null,
       concluida_em: null,
    } as TarefaResponseDTO;

    let tarefa!: TarefaModel;
    let tarefaResponse!: ReturnType<TarefaModel['toResponse']>;

    beforeEach(() => {
        jest.clearAllMocks();
        tarefa = new TarefaModel({ tarefa: tarefaRow });
        tarefaResponse = tarefa.toResponse()!;
    });

    test('should create a tarefa with valid properties', () => {
        expect(tarefa).toBeInstanceOf(TarefaModel);
        expect(tarefa.idTarefa).toBe(1);
        expect(tarefa.gato_id).toBe(1);
        expect(tarefa.descricao).toBe('Sample Task');
        expect(tarefa.pontos).toBe(10);
        expect(tarefa.status).toBe('PENDENTE');
        expect(tarefa.concluida_por).toBeNull();
        expect(tarefa.concluida_em).toBeNull();
    });

    test('should return null for properties if tarefa data is null', () => {
        const emptyTarefa = new TarefaModel({ tarefa: null as any });

        expect(emptyTarefa.idTarefa).toBeNull();
        expect(emptyTarefa.gato_id).toBeNull();
        expect(emptyTarefa.descricao).toBeNull();
        expect(emptyTarefa.pontos).toBeNull();
        expect(emptyTarefa.status).toBeNull();
        expect(emptyTarefa.concluida_por).toBeNull();
        expect(emptyTarefa.concluida_em).toBeNull();
    });

    test('should turn the tarefa to a tarefa response', () => {
        expect(tarefaResponse).toEqual(tarefaRow);
    });

    test('should return null for tarefa response if tarefa data is null', () => {
        const emptyTarefa = new TarefaModel({ tarefa: null as any });

        expect(emptyTarefa.toResponse()).toBeNull();
    });

    test('should find many tarefas by idGato', async () => {
        mockedDbQuery.mockResolvedValueOnce([tarefaRow]);

        const result = await TarefaModel.findMany({idGato: 1});

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC'),
            [1],
        );
        expect(result).toEqual([tarefaRow]);
    });

    test('should return an empty array if no tarefas found for idGato', async () => {
        mockedDbQuery.mockResolvedValueOnce([]);

        const result = await TarefaModel.findMany({idGato: 999});

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC'),
            [999],
        );
        expect(result).toEqual([]);
    });

    test('should find tarefa by Id', async () => {
        mockedDbQuery.mockResolvedValueOnce([tarefaRow]);

        const result = await TarefaModel.findTarefaById(1);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM tarefas t WHERE t.idTarefa = ?'),
            [1],
        );
        expect(result).toEqual(tarefaRow);
    });

    test('should return undefined if no tarefa found for idTarefa', async () => {
        mockedDbQuery.mockResolvedValueOnce([]);

        const result = await TarefaModel.findTarefaById(999);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM tarefas t WHERE t.idTarefa = ?'),
            [999],
        );
        expect(result).toBeUndefined();
    });

    test('should create tarefa with valid data', async () => { 
        const input = {
            gato_id: 1,
            descricao: 'New Task',
            pontos: 5,
            status: 'PENDENTE' as TarefaStatus,
            concluida_por: 1,
            concluida_em: new Date('2024-06-01T10:00:00Z'),
        }

        mockedDbQuery.mockResolvedValueOnce({ insertId: 2 });

        const result = await TarefaModel.createTarefa(input);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)'),
            [input.descricao, input.pontos, input.status, input.concluida_por, input.concluida_em, input.gato_id],
        );
        expect(result).toEqual({ insertId: 2 });

    });    

    test('should delete tarefa with valid idTarefa', async () => {
        mockedDbQuery.mockResolvedValueOnce(undefined);

        await TarefaModel.deletarTarefa(1);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            'DELETE FROM tarefas WHERE idTarefa = ?',
            [1],
        );
    });

    test('should update tarefa with partial valid data and valid idTarefa and idCatSitter', async () => {
        mockedDbQuery.mockResolvedValueOnce({ affectedRows: 1 });

        await TarefaModel.updateTarefa(
            { descricao: 'Updated Task', pontos: 10, status: 'PENDENTE' as TarefaStatus },
            1,
        );

        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE tarefas SET descricao = ?, pontos = ?, status = ? WHERE idTarefa = ?'),
            ['Updated Task', 10, 'PENDENTE', 1],
        );
    });

    test('should updateStatusTarefa with idTarefa and idCatSitter', async () => {
        mockedDbQuery.mockResolvedValueOnce({ affectedRows: 1 });

        await tarefa.updateStatusTarefa(1, 2);
        
        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE tarefas SET status = \'CONCLUIDA\', concluida_em = ?, concluida_por = ? WHERE idTarefa = ?'),
            [expect.any(Date), 2, 1],
        );
    });

    test('should updatePontuacaoCatSitter with idCatSitter and points of the finished tarefa', async () => {
        mockedDbQuery.mockResolvedValueOnce({ affectedRows: 1 });

        await tarefa.updatePontuacaoCatSitter(2, 10);
        
        expect(mockedDbQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE users SET pontuacao = pontuacao + ? WHERE id = ?'),
            [10, 2],
        );
    });

});
