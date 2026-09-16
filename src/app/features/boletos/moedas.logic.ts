import { TaxaMoeda } from './boletos.model';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function filtrarMoedas(moedas: TaxaMoeda[], busca: string): TaxaMoeda[] {
  const q = norm(busca);
  if (!q) {
    return moedas ?? [];
  }
  return (moedas ?? []).filter((m) => norm(m.data).includes(q));
}

export function formatTaxaMoeda(valor: number): string {
  return valor.toFixed(4);
}
