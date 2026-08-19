import { GatoModel } from './gato.model';
import { GatoListFiltersInputDTO, GatoResponseDTO } from '../dtos/gato.dto';
import { TarefaResponseDTO } from '../dtos/tarefa.dto';
import { UserModel } from './user.model';
import { TarefaModel } from './tarefa.model';
import { Action } from './action';
import { gatoRepository, GatoRepository } from '../repositories/gato.repository';
import { tarefaRepository, TarefaRepository } from '../repositories/tarefa.repository';

abstract class CatSitterAction<TResult = void> extends Action<TResult> {
    protected readonly gatoRepository: GatoRepository;
    protected readonly tarefaRepository: TarefaRepository;

    constructor(
        user: UserModel,
        gatoRepositoryDependency: GatoRepository = gatoRepository,
        tarefaRepositoryDependency: TarefaRepository = tarefaRepository,
    ) {
        super(user);
        this.gatoRepository = gatoRepositoryDependency;
        this.tarefaRepository = tarefaRepositoryDependency;
    }
}

export class ListarGatosDisponiveisCatSitterAction extends CatSitterAction<GatoResponseDTO[]> {
    private readonly filters: GatoListFiltersInputDTO;

    constructor(user: UserModel, filters: GatoListFiltersInputDTO, gatoRepositoryDependency?: GatoRepository, tarefaRepositoryDependency?: TarefaRepository) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.filters = filters;
    }

    async run(): Promise<GatoResponseDTO[]> {
        this.requireUserId();
        const gatos = await this.gatoRepository.findMany({
            searchGato: this.filters.searchGato,
            searchTutor: this.filters.searchTutor,
            disponiveis: true,
        });

        return gatos
            .map((gato) => new GatoModel({ gato }).toResponse())
            .filter((gato): gato is GatoResponseDTO => gato !== null);
    }
}

export class ListarTarefasCatSitterAction extends CatSitterAction<TarefaResponseDTO[]> {
    private readonly idGato: number;

    constructor(user: UserModel, idGato: number, gatoRepositoryDependency?: GatoRepository, tarefaRepositoryDependency?: TarefaRepository) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idGato = idGato;
    }

    async run(): Promise<TarefaResponseDTO[]> {
        const gato = await this.gatoRepository.findById(this.idGato);

        if (!gato) {
            throw new Error('Gato não encontrado.');
        }

        if (gato.disponivel_para_cuidado !== 1) {
            throw new Error('Gato não disponível para cuidado.');
        }

        const tarefas = await this.tarefaRepository.findMany(this.idGato);
        return tarefas
            .map((tarefa) => new TarefaModel({ tarefa }).toResponse())
            .filter((tarefa): tarefa is NonNullable<typeof tarefa> => tarefa !== null);
    }
}

export class ConcluirTarefa extends CatSitterAction {
    private readonly idTarefa: number;

    constructor(user: UserModel, idTarefa: number, gatoRepositoryDependency?: GatoRepository, tarefaRepositoryDependency?: TarefaRepository) {
        super(user, gatoRepositoryDependency, tarefaRepositoryDependency);
        this.idTarefa = idTarefa;
    }

    async run(): Promise<void> {
        const idCatSitter = this.requireUserId();
        const tarefa = await this.tarefaRepository.findById(this.idTarefa);

        if (!tarefa) {
            throw new Error('Tarefa não encontrada.');
        }

        const tarefaInstance = new TarefaModel({ tarefa });

        if (tarefaInstance.status === 'CONCLUIDA') {
            throw new Error('A tarefa já foi concluída.');
        }

        const pontos = tarefaInstance.pontos;
        const idTarefa = tarefaInstance.idTarefa;

        if (!idTarefa || !idCatSitter) {
            throw new Error('Tarefa ou usuário inválido para conclusão.');
        }

        if (pontos === null) {
            throw new Error('Tarefa inválida para atualização de pontuação.');
        }

        await this.tarefaRepository.updateStatus(idTarefa, idCatSitter);
        await this.tarefaRepository.addPoints(idCatSitter, pontos);
    }
}