import { GatoCreateInputDTO, GatoListFiltersInputDTO, GatoResponseDTO } from '../dtos/gato.dto';
import { gatoRepository } from '../repositories/gato.repository';

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

  private static __normalizeGato(row: GatoResponseDTO | null): GatoResponseDTO | null {
    if (!row) {
      return null;
    }

    return {
      ...row,
      id: row.id !== undefined ? Number(row.id) : row.id,
      nomeGato: row.nomeGato,
      idadeGato: row.idadeGato,
      pesoGato: row.pesoGato,
      peloGato: Number(row.peloGato),
      racaGato: row.racaGato,
      idIcone: row.idIcone,
      tutor_id: row.tutor_id,
      tutorNome: row.tutorNome,
      disponivel_para_cuidado: row.disponivel_para_cuidado ?? 1,
    };
  }

  static async findMany(filters: GatoListFiltersInputDTO = {}): Promise<GatoResponseDTO[]> {
    const rows = await gatoRepository.findMany(filters);
    return rows.map((row) => GatoModel.__normalizeGato(row) as GatoResponseDTO);
  }

  static async findGatoByIdGato(id: number): Promise<GatoResponseDTO | null> {
    return GatoModel.__normalizeGato(await gatoRepository.findById(id));
  }

  static async createGato(data: GatoCreateInputDTO): Promise<GatoResponseDTO> {
    const newGato = await gatoRepository.create(data);
    return GatoModel.__normalizeGato(newGato) as GatoResponseDTO;
  }

  static async updateGato(
    id: number,
    data: {
      nomeGato: string;
      idadeGato: number;
      pesoGato: number;
      peloGato: number;
      racaGato: string;
      idIcone: number;
      disponivel_para_cuidado: 0 | 1;
    },
  ): Promise<void> {
    await gatoRepository.update(id, data);
  }

}



