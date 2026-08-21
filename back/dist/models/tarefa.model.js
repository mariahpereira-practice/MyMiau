"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarefaModel = void 0;
class TarefaModel {
    constructor(data) {
        this.__tarefaRow = data.tarefa;
    }
    get idTarefa() {
        return this.__tarefaRow?.idTarefa || null;
    }
    get gato_id() {
        return this.__tarefaRow?.gato_id || null;
    }
    get descricao() {
        return this.__tarefaRow?.descricao || null;
    }
    get pontos() {
        return this.__tarefaRow?.pontos || null;
    }
    get status() {
        return this.__tarefaRow?.status || null;
    }
    get concluida_por() {
        return this.__tarefaRow?.concluida_por || null;
    }
    get concluida_em() {
        return this.__tarefaRow?.concluida_em || null;
    }
    toResponse() {
        if (!this.__tarefaRow) {
            return null;
        }
        const response = {
            idTarefa: this.idTarefa,
            gato_id: this.gato_id,
            descricao: this.descricao,
            pontos: this.pontos,
            status: this.status,
            concluida_por: this.concluida_por ?? null,
            concluida_em: this.concluida_em ?? null,
        };
        return response;
    }
}
exports.TarefaModel = TarefaModel;
//# sourceMappingURL=tarefa.model.js.map