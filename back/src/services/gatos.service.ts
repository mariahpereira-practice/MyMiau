import { findMany } from '../models/gato.model';

export async function listGatos({
  id,
  search,
}: {
  id?: unknown;
  search?: unknown;
}) {
  const gatos = await findMany({ id, search });
  return gatos;
}
