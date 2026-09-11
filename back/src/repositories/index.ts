import { DATABASE_DRIVER } from '../config/database';
import type { GatoRepository } from './gato.repository';
import type { TarefaRepository } from './tarefa.repository';
import type { UserRepository } from './user.repository';
import { mariaDbGatoRepository } from './mariadb/gato.repository';
import { mariaDbTarefaRepository } from './mariadb/tarefa.repository';
import { mariaDbUserRepository } from './mariadb/user.repository';
import { mongoDbGatoRepository } from './mongodb/gato.repository';
import { mongoDbTarefaRepository } from './mongodb/tarefa.repository';
import { mongoDbUserRepository } from './mongodb/user.repository';

const isMongo = DATABASE_DRIVER === 'mongodb';

export const gatoRepository: GatoRepository = isMongo
  ? mongoDbGatoRepository
  : mariaDbGatoRepository;

export const tarefaRepository: TarefaRepository = isMongo
  ? mongoDbTarefaRepository
  : mariaDbTarefaRepository;

export const userRepository: UserRepository = isMongo
  ? mongoDbUserRepository
  : mariaDbUserRepository;

export type { GatoRepository, TarefaRepository, UserRepository };
