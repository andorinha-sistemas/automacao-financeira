import { ClienteCadastro } from './boletos.model';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function filtrarClientes(clientes: ClienteCadastro[], busca: string): ClienteCadastro[] {
  const q = norm(busca);
  if (!q) {
    return clientes ?? [];
  }
  return (clientes ?? []).filter((c) =>
    [c.filial, c.codigo, c.loja, c.nome, c.nFantasia, c.tipo, c.regiao].some((v) => norm(v).includes(q)),
  );
}
