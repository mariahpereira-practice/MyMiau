"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatoModel = void 0;
class GatoModel {
    constructor(data) {
        this.__gatoRow = data.gato;
    }
    get id() {
        return this.__gatoRow?.id || null;
    }
    get nomeGato() {
        return this.__gatoRow?.nomeGato || null;
    }
    get idadeGato() {
        return this.__gatoRow?.idadeGato || null;
    }
    get pesoGato() {
        return this.__gatoRow?.pesoGato || null;
    }
    get peloGato() {
        return this.__gatoRow?.peloGato || null;
    }
    get racaGato() {
        return this.__gatoRow?.racaGato || null;
    }
    get idIcone() {
        return this.__gatoRow?.idIcone || null;
    }
    get tutorId() {
        return this.__gatoRow?.tutor_id || null;
    }
    get tutorNome() {
        return this.__gatoRow?.tutorNome || null;
    }
    get disponivelParaCuidado() {
        return this.__gatoRow?.disponivel_para_cuidado ?? null;
    }
    toResponse() {
        if (!this.__gatoRow) {
            return null;
        }
        if (this.id === null
            || this.nomeGato === null
            || this.idadeGato === null
            || this.pesoGato === null
            || this.peloGato === null
            || this.racaGato === null
            || this.idIcone === null
            || this.tutorId === null) {
            return null;
        }
        return {
            id: this.id,
            nomeGato: this.nomeGato,
            idadeGato: this.idadeGato,
            pesoGato: this.pesoGato,
            peloGato: this.peloGato,
            racaGato: this.racaGato,
            idIcone: this.idIcone,
            tutor_id: this.tutorId,
            tutorNome: this.tutorNome ?? '',
            disponivel_para_cuidado: this.disponivelParaCuidado ?? 1,
        };
    }
}
exports.GatoModel = GatoModel;
//# sourceMappingURL=gato.model.js.map