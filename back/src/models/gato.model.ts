import { GatoResponseDTO } from '../dtos/gato.dto';

export class GatoModel {
  private __gatoRow: GatoResponseDTO | null;

  constructor(data: { gato: GatoResponseDTO }) {
    this.__gatoRow = data.gato;
  }

  get id(): number | null {
    return this.__gatoRow?.id || null;
  }

  get nomeGato(): string | null {
    return this.__gatoRow?.nomeGato || null;
  }

  get idadeGato(): number | null {
    return this.__gatoRow?.idadeGato || null;
  }

  get pesoGato(): number | null {
    return this.__gatoRow?.pesoGato || null;
  }

  get peloGato(): number | null {
    return this.__gatoRow?.peloGato || null;
  }

  get racaGato(): string | null {
    return this.__gatoRow?.racaGato || null;
  }

  get idIcone(): number | null {
    return this.__gatoRow?.idIcone || null;
  }

  get tutorId(): number | null {
    return this.__gatoRow?.tutor_id || null;
  }

  get tutorNome(): string | null {
    return this.__gatoRow?.tutorNome || null;
  }

  get disponivelParaCuidado(): 0 | 1 | null {
    return this.__gatoRow?.disponivel_para_cuidado ?? null;
  }

  toResponse(): GatoResponseDTO | null {
    if (!this.__gatoRow) {
      return null;
    }

    if (
      this.id === null
      || this.nomeGato === null
      || this.idadeGato === null
      || this.pesoGato === null
      || this.peloGato === null
      || this.racaGato === null
      || this.idIcone === null
      || this.tutorId === null
    ) {
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



