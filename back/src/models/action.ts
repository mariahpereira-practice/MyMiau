import { UserModel } from './user.model';
import { TarefaModel } from './tarefa.model';

abstract class Action {

    protected user: UserModel;
    protected tarefa: TarefaModel;

    constructor(user: UserModel, tarefa: TarefaModel) {
        this.user = user;
        this.tarefa = tarefa;
    }

    abstract run(): Promise<void>;
}

export class ConcluirTarefa extends Action {

    async run(): Promise<void> {
        const pontos = this.tarefa.pontos;
        const idTarefa = this.tarefa.idTarefa;
        const idCatSitter = this.user.id;

        if(!idTarefa || !idCatSitter) {
            throw new Error('Tarefa ou usuário inválido para conclusão.');
        }

        await this.tarefa.updateStatusTarefa(idTarefa, idCatSitter);
        if (pontos) {
            await this.tarefa.updatePontuacaoCatSitter(idCatSitter, pontos);
        }
    }
}