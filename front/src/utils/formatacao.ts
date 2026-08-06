export function nomeFormatado(nome: string | undefined): string {
  if (!nome || nome.trim() === '') {
    return 'Não informado';
  }

  const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  return nomeFormatado;
}

export function peloFormatado(pelo: string | undefined): string {
  switch (pelo) {
    case '1':
      return 'Curto';
    case '2':
      return 'Médio';
    case '3':
      return 'Longo';
    default:
      return 'Não informado';
  }
}