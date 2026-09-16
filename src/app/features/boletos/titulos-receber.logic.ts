import { TituloReceber } from './boletos.model';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export type SituacaoReceber = 'baixado' | 'atrasado' | 'parcial' | 'aberto';

export function situacaoTituloReceber(titulo: TituloReceber): SituacaoReceber {
  if (titulo.status === 'baixado') {
    return 'baixado';
  }
  if (titulo.atrasado) {
    return 'atrasado';
  }
  if (titulo.status === 'parcBaixado') {
    return 'parcial';
  }
  return 'aberto';
}

export function filtrarTitulosReceber(titulos: TituloReceber[], busca: string): TituloReceber[] {
  const q = norm(busca);
  if (!q) {
    return titulos ?? [];
  }
  return (titulos ?? []).filter((t) =>
    [t.prefixo, t.numero, t.parcela, t.tipo, t.natureza, t.portador, t.cliente, t.nomeCliente].some((v) =>
      norm(v).includes(q),
    ),
  );
}
