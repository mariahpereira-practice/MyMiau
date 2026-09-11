import type {
  GatoCreateInputDTO,
  GatoListFiltersInputDTO,
  GatoResponseDTO,
} from '../dtos/gato.dto';

export interface GatoUpdateRepositoryInput {
  nomeGato: string;
  idadeGato: number;
  pesoGato: number;
  peloGato: number;
  racaGato: string;
  idIcone: number;
  disponivel_para_cuidado: 0 | 1;
}

export interface GatoRepository {
  findMany(filters?: GatoListFiltersInputDTO): Promise<GatoResponseDTO[]>;
  findById(id: string): Promise<GatoResponseDTO | null>;
  create(data: GatoCreateInputDTO): Promise<GatoResponseDTO>;
  update(id: string, data: GatoUpdateRepositoryInput): Promise<void>;
}

