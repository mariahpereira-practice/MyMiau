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
    nomeTutor: string;
    enderecoTutor: string;
    telefoneTutor: string;
}


