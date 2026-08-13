import { GatoListFiltersInputDTO, GatoCreateInputDTO, GatoResponseDTO, GatoUpdateInputDTO } from '../dtos/gato.dto';
import { CreateTarefaInputDTO, TarefaResponseDTO, UpdateTarefaInputDTO } from '../dtos/tarefa.dto';
import { Action } from './action';
import { GatoModel } from './gato.model';
import { UserModel } from './user.model';
import { TarefaModel } from './tarefa.model';

export abstract class TutorAction<TResult = void> extends Action<TResult> {
    constructor(user: UserModel) {
        super(user);
    }
}

export class ListarMeusGatosTutorAction extends TutorAction<GatoResponseDTO[]> {
    private readonly filters: GatoListFiltersInputDTO;

    constructor(user: UserModel, filters: GatoListFiltersInputDTO) {
        super(user);
        this.filters = filters;
    }

    async run(): Promise<GatoResponseDTO[]> {
        const tutorId = this.requireUserId();
        const gatos = await GatoModel.findMany({
            tutorId,
            searchGato: this.filters.searchGato,
            searchTutor: this.filters.searchTutor,
        });
        return gatos
            .map((gato) => new GatoModel({ gato }).toResponse())
            .filter((gato): gato is GatoResponseDTO => gato !== null);
    }
}

export class CriarGatoTutorAction extends TutorAction<GatoResponseDTO> {
    private readonly data: GatoCreateInputDTO;

    constructor(user: UserModel, data: GatoCreateInputDTO) {
        super(user);
        this.data = data;
    }

    async run(): Promise<GatoResponseDTO> {
        const tutorId = this.requireUserId();

        if (
            !this.data.nomeGato?.trim()
            || this.data.idadeGato == null
            || this.data.pesoGato == null
            || this.data.peloGato == null
            || !this.data.racaGato?.trim()
            || this.data.idIcone == null
            || this.data.tutor_id == null
        ) {
            throw new Error('Todos os campos são obrigatórios para salvar um gato.');
        }

        if (this.data.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para criar gato para este tutor.');
        }

        const existingGatos = await GatoModel.findMany({
            searchGato: this.data.nomeGato,
            tutorId,
        });

        if (existingGatos.length > 0) {
            throw new Error('Já existe um gato com esse nome para este tutor.');
        }

        const newGato = await GatoModel.createGato({
            nomeGato: this.data.nomeGato,
            idadeGato: this.data.idadeGato,
            pesoGato: this.data.pesoGato,
            peloGato: this.data.peloGato,
            racaGato: this.data.racaGato,
            idIcone: this.data.idIcone,
            tutor_id: tutorId,
        });

        const gato = new GatoModel({ gato: newGato });
        const gatoResponse = gato.toResponse();
        if (!gatoResponse) {
            throw new Error('Erro ao normalizar resposta do gato criado.');
        }

        return gatoResponse;
    }
}

export class AtualizarGatoTutorAction extends TutorAction<GatoResponseDTO> {
    private readonly idGato: number;
    private readonly data: GatoUpdateInputDTO;

    constructor(user: UserModel, idGato: number, data: GatoUpdateInputDTO) {
        super(user);
        this.idGato = idGato;
        this.data = data;
    }

    async run(): Promise<GatoResponseDTO> {
        const tutorId = this.requireUserId();
        const gatoRow = await GatoModel.findGatoByIdGato(this.idGato);

        if (!gatoRow) {
            throw new Error('Gato não encontrado.');
        }

        const gato = new GatoModel({ gato: gatoRow });

        if (gato.tutorId !== tutorId) {
            throw new Error('Você não tem permissão para atualizar este gato.');
        }

        if (
            gato.id === null
            || gato.nomeGato === null
            || gato.idadeGato === null
            || gato.pesoGato === null
            || gato.peloGato === null
            || gato.racaGato === null
            || gato.idIcone === null
            || gato.tutorId === null
        ) {
            throw new Error('Dados do gato inválidos para atualização.');
        }

        const payload = {
            nomeGato: this.data.nomeGato ?? gato.nomeGato,
            idadeGato: this.data.idadeGato ?? gato.idadeGato,
            pesoGato: this.data.pesoGato ?? gato.pesoGato,
            peloGato: this.data.peloGato ?? gato.peloGato,
            racaGato: this.data.racaGato ?? gato.racaGato,
            idIcone: this.data.idIcone ?? gato.idIcone,
            disponivel_para_cuidado: this.data.disponivel_para_cuidado ?? gato.disponivelParaCuidado ?? 1,
        };

        await GatoModel.updateGato(this.idGato, payload);

        const updatedRow = await GatoModel.findGatoByIdGato(this.idGato);
        if (!updatedRow) {
            throw new Error('Erro ao buscar gato atualizado.');
        }

        const gatoUpdated = new GatoModel({ gato: updatedRow });
        const gatoResponse = gatoUpdated.toResponse();
        if (!gatoResponse) {
            throw new Error('Erro ao normalizar resposta do gato atualizado.');
        }

        return gatoResponse;
    }
}

export class ListarTarefasTutorAction extends TutorAction<TarefaResponseDTO[]> {
    private readonly idGato: number;

    constructor(user: UserModel, idGato: number) {
        super(user);
        this.idGato = idGato;
    }

    async run(): Promise<TarefaResponseDTO[]> {
        const tutorId = this.requireUserId();
        const gato = await GatoModel.findGatoByIdGato(this.idGato);

        if (!gato) {
            throw new Error('Gato não encontrado.');
        }

        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para visualizar as tarefas deste gato.');
        }

        const tarefas = await TarefaModel.findMany({ idGato: this.idGato });
        return tarefas
            .map((tarefa) => new TarefaModel({ tarefa }).toResponse())
            .filter((tarefa): tarefa is NonNullable<typeof tarefa> => tarefa !== null);
    }
}

export class CriarTarefaTutorAction extends TutorAction {
    private readonly idGato: number;
    private readonly data: CreateTarefaInputDTO;

    constructor(user: UserModel, idGato: number, data: CreateTarefaInputDTO) {
        super(user);
        this.idGato = idGato;
        this.data = data;
    }

    async run(): Promise<void> {
        const tutorId = this.requireUserId();
        const gato = await GatoModel.findGatoByIdGato(this.idGato);

        if (!gato) {
            throw new Error('Gato não encontrado.');
        }

        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para criar tarefas para este gato.');
        }

        if (!this.data.descricao?.trim() || this.data.pontos == null) {
            throw new Error('Descrição e pontos são obrigatórios para salvar uma tarefa.');
        }

        await TarefaModel.createTarefa({
            gato_id: this.idGato,
            descricao: this.data.descricao,
            pontos: this.data.pontos,
            status: 'PENDENTE',
            concluida_por: tutorId,
            concluida_em: new Date(),
        });
    }
}

export class AtualizarTarefaTutorAction extends TutorAction {
    private readonly idGato: number;
    private readonly idTarefa: number;
    private readonly data: UpdateTarefaInputDTO;

    constructor(user: UserModel, idGato: number, idTarefa: number, data: UpdateTarefaInputDTO) {
        super(user);
        this.idGato = idGato;
        this.idTarefa = idTarefa;
        this.data = data;
    }

    async run(): Promise<void> {
        const tutorId = this.requireUserId();
        const gato = await GatoModel.findGatoByIdGato(this.idGato);

        if (!gato) {
            throw new Error('Gato não encontrado.');
        }

        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para atualizar tarefas deste gato.');
        }

        const tarefa = await TarefaModel.findTarefaById(this.idTarefa);

        if (!tarefa) {
            throw new Error('Tarefa não encontrada.');
        }

        const tarefaInstance = new TarefaModel({ tarefa });

        if (tarefaInstance.gato_id !== this.idGato) {
            throw new Error('A tarefa não pertence a este gato.');
        }

        if (tarefaInstance.descricao === null || tarefaInstance.pontos === null || tarefaInstance.status === null) {
            throw new Error('Dados da tarefa inválidos para atualização.');
        }

        const payload = {
            descricao: this.data.descricao ?? tarefaInstance.descricao,
            pontos: this.data.pontos ?? tarefaInstance.pontos,
            status: this.data.status ?? tarefaInstance.status,
        };

        await TarefaModel.updateTarefa(payload, this.idTarefa);
    }
}

export class DeletarTarefaTutorAction extends TutorAction {
    private readonly idGato: number;
    private readonly idTarefa: number;

    constructor(user: UserModel, idGato: number, idTarefa: number) {
        super(user);
        this.idGato = idGato;
        this.idTarefa = idTarefa;
    }

    async run(): Promise<void> {
        const tutorId = this.requireUserId();
        const gato = await GatoModel.findGatoByIdGato(this.idGato);

        if (!gato) {
            throw new Error('Gato não encontrado.');
        }

        if (gato.tutor_id !== tutorId) {
            throw new Error('Você não tem permissão para deletar tarefas deste gato.');
        }

        const tarefa = await TarefaModel.findTarefaById(this.idTarefa);

        if (!tarefa) {
            throw new Error('Tarefa não encontrada.');
        }

        const tarefaInstance = new TarefaModel({ tarefa });

        if (tarefaInstance.gato_id !== this.idGato) {
            throw new Error('A tarefa não pertence a este gato.');
        }

        await TarefaModel.deletarTarefa(this.idTarefa);
    }
}

