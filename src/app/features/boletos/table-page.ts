export const TAMANHO_PAGINA = 10;
export const ALTURA_LINHA_TABELA = 48;
export const ALTURA_CABECALHO_TABELA = 44;

export function linhasQueCabem(
  alturaArea: number,
  alturaLinha = ALTURA_LINHA_TABELA,
  alturaCabecalho = ALTURA_CABECALHO_TABELA,
): number {
  if (alturaArea <= alturaCabecalho) {
    return TAMANHO_PAGINA;
  }
  return Math.max(1, Math.floor((alturaArea - alturaCabecalho) / Math.max(1, alturaLinha)));
}

export function totalPaginas(total: number, tamanho = TAMANHO_PAGINA): number {
  return Math.max(1, Math.ceil(Math.max(0, total) / tamanho) || 1);
}

export function paginaDe<T>(items: readonly T[], pagina: number, tamanho = TAMANHO_PAGINA): T[] {
  const start = (Math.max(1, pagina) - 1) * tamanho;
  return items.slice(start, start + tamanho);
}

export function rotuloPagina(total: number, pagina: number, tamanho = TAMANHO_PAGINA): string {
  if (total <= 0) {
    return '0 de 0';
  }
  const atual = Math.min(Math.max(1, pagina), totalPaginas(total, tamanho));
  const inicio = (atual - 1) * tamanho + 1;
  const fim = Math.min(total, inicio + tamanho - 1);
  return `${inicio} - ${fim} de ${total}`;
}
