import { FiltrosRapidos, TituloReceber, TotaisBoletos } from './boletos.model';

const STATUS_KEYS = ['aberto', 'parcBaixado', 'baixado'] as const;
const BORDERO_KEYS = ['comBordero', 'semBordero'] as const;
const CONCIL_KEYS = ['conciliado', 'naoConciliado'] as const;
const BANCO_KEYS = ['itau', 'santander', 'bb', 'safra', 'bradesco', 'caixa'] as const;
const QUICK_KEYS = [
  ...STATUS_KEYS,
  ...BORDERO_KEYS,
  'adiantamento',
  'vencido',
  ...CONCIL_KEYS,
] as const;

function resetQuick(atual: FiltrosRapidos): FiltrosRapidos {
  return {
    ...atual,
    todos: true,
    aberto: false,
    parcBaixado: false,
    baixado: false,
    comBordero: false,
    semBordero: false,
    adiantamento: false,
    vencido: false,
    conciliado: false,
    naoConciliado: false,
  };
}

function resetBancos(atual: FiltrosRapidos): FiltrosRapidos {
  return {
    ...atual,
    bancosTodos: true,
    itau: false,
    santander: false,
    bb: false,
    safra: false,
    bradesco: false,
    caixa: false,
  };
}

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
    return resetQuick(atual);
  }
  if (chave === 'bancosTodos') {
    return resetBancos(atual);
  }

  const next: FiltrosRapidos = { ...atual, [chave]: !atual[chave] };
  if ((BANCO_KEYS as readonly string[]).includes(chave)) {
    next.bancosTodos = false;
    if (!BANCO_KEYS.some((key) => next[key])) {
      return resetBancos(next);
    }
    return next;
  }

  next.todos = false;
  if (!QUICK_KEYS.some((key) => next[key])) {
    return resetQuick(next);
  }
  return next;
}

export function temFiltroAplicado(filtros: FiltrosRapidos, busca: string): boolean {
  return !filtros.todos || !filtros.bancosTodos || busca.trim().length > 0;
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
    if (filtros.todos && filtros.bancosTodos) {
      return true;
    }
    const statusOk =
      filtros.todos ||
      (matchesGroup(filtros, STATUS_KEYS, (key) => t.status === key) &&
        matchesGroup(filtros, BORDERO_KEYS, (key) =>
          key === 'comBordero' ? t.bordero : !t.bordero,
        ) &&
        (!filtros.adiantamento || t.adiantamento) &&
        (!filtros.vencido || t.atrasado) &&
        matchesGroup(filtros, CONCIL_KEYS, (key) =>
          key === 'conciliado' ? t.conciliado === true : t.conciliado === false,
        ));
    const bancoOk =
      filtros.bancosTodos || matchesGroup(filtros, BANCO_KEYS, (key) => t.banco === key);
    return statusOk && bancoOk;
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
