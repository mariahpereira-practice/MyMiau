export interface GatoRequest {
    nomeGato: string;
    idadeGato: number;
    pesoGato: number;
    peloGato: number;
    racaGato: string;
    idIcone: number;
    tutor_id: number;
    disponivel_para_cuidado?: 0 | 1;
}

export interface GatoResponse {
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

