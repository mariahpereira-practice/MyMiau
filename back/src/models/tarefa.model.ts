import db from '../config/database';
import { Tarefa } from '../types/tarefa';

export async function findMany({
  idGato,
}: {
  idGato: number;
}): Promise<Tarefa[]> {
  const sql = `SELECT * FROM tarefas t WHERE t.gato_id = ? ORDER BY t.idTarefa DESC`;

  const rows = await db.query<Tarefa[]>(sql, [idGato]);
  return rows;
}

export async function createTarefa(data: {
  descricao: string;
  pontos: number;
  status: 'PENDENTE' | 'CONCLUIDA';
  concluida_por: number | null;
  concluida_em: Date;
  gato_id: number;
}): Promise<{ insertId: number }> {
  const sql = `INSERT INTO tarefas (descricao, pontos, status, concluida_por, concluida_em, gato_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const result = await db.query<{ insertId: number }>(sql, [
    data.descricao,
    data.pontos,
    data.status,
    data.concluida_por,
    data.concluida_em,
    data.gato_id,
  ]);
  return result;
}