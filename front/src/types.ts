export interface AuthResponse {
    jwt: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'TUTOR' | 'CATSITTER' | 'MODERATOR' | 'ADMIN';
    pontuacao: number;
    rankGlobal: string;
}

export interface Gato {
    id: number;
    nomeGato: string;
    idadeGato: number;
    pesoGato: number;
    peloGato: string;
    racaGato: string;
    idIcone: number;
    tutor_id: number;
    tutorNome?: string;
    disponivel_para_cuidado: boolean;
}

export interface Tarefa {
    idTarefa: number;
    gato_id: number;
    descricao: string;
    pontos: number;
    status: 'PENDENTE' | 'CONCLUIDA';
    concluida_por: number | null;
    concluida_em: Date | null;
}