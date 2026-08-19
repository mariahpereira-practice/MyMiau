import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { TarefaResponseDTO } from '../../../src/dtos/tarefa.dto';
import { TarefaModel } from '../../../src/models/tarefa.model';

describe('Tarefa Model', () => {
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

});
