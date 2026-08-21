export interface GatoResponseDTO {
  id: number;
  nomeGato: string;
  idadeGato: number;
  pesoGato: number;
  peloGato: number;
  racaGato: string;
  idIcone: number;
  tutor_id: number;
  tutorNome: string;
  disponivel_para_cuidado: 0 | 1;
}

export interface GatoCreateRequestDTO {
  nomeGato: string;
  idadeGato: number;
  pesoGato: number;
  peloGato: number;
  racaGato: string;
  idIcone: number;
  disponivel_para_cuidado?: 0 | 1 | boolean;
}

export interface GatoCreateInputDTO extends GatoCreateRequestDTO {
  tutor_id: number;
}

export interface GatoUpdateInputDTO extends Partial<GatoCreateRequestDTO> {
}

export interface GatoListFiltersInputDTO {
  searchGato?: unknown;
  searchTutor?: unknown;
  tutorId?: unknown;
  disponiveis?: unknown;
}