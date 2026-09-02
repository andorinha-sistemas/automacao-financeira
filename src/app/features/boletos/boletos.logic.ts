import {
  FILTROS_INICIAIS,
  FiltrosRapidos,
  TituloReceber,
  TotaisBoletos,
} from './boletos.model';

const STATUS_KEYS = ['aberto', 'parcBaixado', 'baixado'] as const;
const BORDERO_KEYS = ['comBordero', 'semBordero'] as const;
const CONCIL_KEYS = ['conciliado', 'naoConciliado'] as const;
const BANCO_KEYS = ['itau', 'santander', 'bb', 'safra'] as const;
const SPECIFIC_KEYS = [
  ...STATUS_KEYS,
  ...BORDERO_KEYS,
  'adiantamento',
  ...CONCIL_KEYS,
  ...BANCO_KEYS,
] as const;

export function toCents(n: number): number {
  return Math.round(n * 100);
}

export function fromCents(c: number): number {
  return c / 100;
}

export function formatBrl(n: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function aplicarFiltroRapido(
  atual: FiltrosRapidos,
  chave: keyof FiltrosRapidos,
): FiltrosRapidos {
  if (chave === 'todos') {
    return { ...FILTROS_INICIAIS };
  }

  const next: FiltrosRapidos = { ...atual, [chave]: !atual[chave], todos: false };
  const anySpecific = SPECIFIC_KEYS.some((key) => next[key]);
  if (!anySpecific) {
    return { ...FILTROS_INICIAIS };
  }
  return next;
}

export function temFiltroAplicado(filtros: FiltrosRapidos, busca: string): boolean {
  return !filtros.todos || busca.trim().length > 0;
}

function matchesGroup<K extends keyof FiltrosRapidos>(
  filtros: FiltrosRapidos,
  keys: readonly K[],
  match: (key: K) => boolean,
): boolean {
  const active = keys.filter((key) => filtros[key]);
  if (active.length === 0) {
    return true;
  }
  return active.some(match);
}

export function filtrarTitulos(
  titulos: TituloReceber[],
  filtros: FiltrosRapidos,
  busca: string,
): TituloReceber[] {
  const q = busca.trim().toLowerCase();
  return titulos.filter((t) => {
    if (q) {
      const hit =
        t.numero.toLowerCase().includes(q) ||
        t.nomeCliente.toLowerCase().includes(q) ||
        t.prefixo.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (filtros.todos) {
      return true;
    }
    const statusOk = matchesGroup(filtros, STATUS_KEYS, (key) => t.status === key);
    const borderoOk = matchesGroup(filtros, BORDERO_KEYS, (key) =>
      key === 'comBordero' ? t.bordero : !t.bordero,
    );
    const adiantOk = !filtros.adiantamento || t.adiantamento;
    const concilOk = matchesGroup(filtros, CONCIL_KEYS, (key) =>
      key === 'conciliado' ? t.conciliado === true : t.conciliado === false,
    );
    const bancoOk = matchesGroup(filtros, BANCO_KEYS, (key) => t.banco === key);
    return statusOk && borderoOk && adiantOk && concilOk && bancoOk;
  });
}

export function calcularTotais(
  visiveis: TituloReceber[],
  selecionados: ReadonlySet<string>,
): TotaisBoletos {
  const sum = (pred: (t: TituloReceber) => boolean): number =>
    fromCents(visiveis.filter(pred).reduce((s, t) => s + toCents(t.valor), 0));

  return {
    contagem: visiveis.length,
    total: sum(() => true),
    aberto: sum((t) => t.status === 'aberto'),
    baixado: sum((t) => t.status === 'baixado'),
    conciliado: sum((t) => t.conciliado === true),
    naoConciliado: sum((t) => t.status === 'baixado' && t.conciliado === false),
    marcado: sum((t) => selecionados.has(t.id)),
  };
}
